import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

const BLOCKSTREAM_API = "https://blockstream.info/api";

type BitcoinOutput = {
  scriptpubkey_address?: string;
  value: number;
};

type BitcoinTransaction = {
  txid: string;
  vout: BitcoinOutput[];
  status: {
    confirmed: boolean;
  };
};

type DepositAddress = {
  address: string;
  asset: string;
  network: string;
};

type DepositRecord = {
  id: string;
  user_id: string;
  amount: number;
  asset: string | null;
  network: string | null;
  deposit_address_id: string | null;
  transaction_hash: string | null;
  status: string;
  verification_status: string;
  verified_amount: number | null;
  deposit_addresses: DepositAddress | DepositAddress[] | null;
};

export async function POST(request: Request) {
  try {
    /*
     * User-scoped client.
     * Used only to authenticate the current user and
     * make sure the deposit belongs to them.
     */
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    /*
     * Server-only privileged client.
     * NEVER expose this client or its secret key to the browser.
     */
    const adminSupabase = createAdminClient();

    // -----------------------------------------
    // 1. Authenticate the user
    // -----------------------------------------

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "You must be authenticated.",
        },
        { status: 401 },
      );
    }

    // -----------------------------------------
    // 2. Read request body
    // -----------------------------------------

    const body = await request.json();

    const depositId = body.depositId;
    const transactionHash = body.transactionHash?.trim();

    if (!depositId || !transactionHash) {
      return NextResponse.json(
        {
          error: "Deposit ID and transaction hash are required.",
        },
        { status: 400 },
      );
    }

    // -----------------------------------------
    // 3. Get the user's deposit
    // -----------------------------------------

    const { data: rawDeposit, error: depositError } = await supabase
      .from("deposits")
      .select(
        `
            id,
            user_id,
            amount,
            asset,
            network,
            deposit_address_id,
            transaction_hash,
            status,
            verification_status,
            verified_amount,
            deposit_addresses (
              address,
              asset,
              network
            )
          `,
      )
      .eq("id", depositId)
      .eq("user_id", user.id)
      .single();

    const deposit = rawDeposit as DepositRecord | null;

    if (depositError || !deposit) {
      return NextResponse.json(
        {
          error: "Deposit not found.",
        },
        { status: 404 },
      );
    }

    // -----------------------------------------
    // 4. Only pending deposits can be verified
    // -----------------------------------------

    if (deposit.status !== "pending") {
      return NextResponse.json(
        {
          error: "Only pending deposits can be verified.",
        },
        { status: 400 },
      );
    }

    // -----------------------------------------
    // 5. Bitcoin only for now
    // -----------------------------------------

    if (
      deposit.asset !== "BTC" ||
      deposit.network?.toLowerCase() !== "bitcoin"
    ) {
      return NextResponse.json(
        {
          error: "This verifier currently supports Bitcoin deposits only.",
        },
        { status: 400 },
      );
    }

    // -----------------------------------------
    // 6. Prevent TX hash reuse
    // -----------------------------------------

    const { data: existingTransaction, error: existingTransactionError } =
      await adminSupabase
        .from("deposits")
        .select("id")
        .eq("transaction_hash", transactionHash)
        .neq("id", depositId)
        .maybeSingle();

    if (existingTransactionError) {
      console.error("Transaction lookup error:", existingTransactionError);

      return NextResponse.json(
        {
          error: "Could not check whether this transaction was already used.",
        },
        { status: 500 },
      );
    }

    if (existingTransaction) {
      return NextResponse.json(
        {
          error: "This transaction hash has already been used.",
        },
        { status: 409 },
      );
    }

    // -----------------------------------------
    // 7. Mark verification as checking
    // -----------------------------------------

    const { error: checkingError } = await adminSupabase
      .from("deposits")
      .update({
        verification_status: "checking",
        verification_error: null,
      })
      .eq("id", depositId)
      .eq("user_id", user.id)
      .eq("status", "pending");

    if (checkingError) {
      console.error("Could not mark deposit as checking:", checkingError);

      return NextResponse.json(
        {
          error: "Could not start deposit verification.",
        },
        { status: 500 },
      );
    }

    // -----------------------------------------
    // 8. Query Bitcoin blockchain
    // -----------------------------------------

    const response = await fetch(
      `${BLOCKSTREAM_API}/tx/${encodeURIComponent(transactionHash)}`,
      {
        cache: "no-store",
      },
    );

    // -----------------------------------------
    // 9. Transaction doesn't exist
    // -----------------------------------------

    if (!response.ok) {
      await adminSupabase
        .from("deposits")
        .update({
          verification_status: "rejected",
          verification_error: "Bitcoin transaction was not found.",
        })
        .eq("id", depositId)
        .eq("user_id", user.id);

      return NextResponse.json(
        {
          error:
            "Bitcoin transaction was not found. Check the transaction hash and try again.",
        },
        { status: 400 },
      );
    }

    const transaction = (await response.json()) as BitcoinTransaction;

    // -----------------------------------------
    // 10. Verify transaction hash
    // -----------------------------------------

    if (transaction.txid !== transactionHash) {
      await adminSupabase
        .from("deposits")
        .update({
          verification_status: "rejected",
          verification_error: "Transaction hash mismatch.",
        })
        .eq("id", depositId)
        .eq("user_id", user.id);

      return NextResponse.json(
        {
          error: "Transaction hash mismatch.",
        },
        { status: 400 },
      );
    }

    // -----------------------------------------
    // 11. Require confirmation
    // -----------------------------------------

    if (!transaction.status.confirmed) {
      await adminSupabase
        .from("deposits")
        .update({
          verification_status: "unverified",
          verification_error: "Transaction exists but is not confirmed yet.",
        })
        .eq("id", depositId)
        .eq("user_id", user.id);

      return NextResponse.json(
        {
          error:
            "Transaction found, but it is not confirmed yet. Your deposit remains pending.",
        },
        { status: 400 },
      );
    }

    // -----------------------------------------
    // 12. Get configured receiving address
    // -----------------------------------------

    const depositAddress = Array.isArray(deposit.deposit_addresses)
      ? deposit.deposit_addresses[0]
      : deposit.deposit_addresses;

    const receivingAddress = depositAddress?.address ?? null;

    if (!receivingAddress) {
      await adminSupabase
        .from("deposits")
        .update({
          verification_status: "rejected",
          verification_error: "Deposit receiving address could not be loaded.",
        })
        .eq("id", depositId)
        .eq("user_id", user.id);

      return NextResponse.json(
        {
          error: "Deposit receiving address could not be loaded.",
        },
        { status: 500 },
      );
    }

    // -----------------------------------------
    // 13. Find outputs sent to our address
    // -----------------------------------------

    const matchingOutputs = transaction.vout.filter(
      (output) => output.scriptpubkey_address === receivingAddress,
    );

    if (matchingOutputs.length === 0) {
      await adminSupabase
        .from("deposits")
        .update({
          verification_status: "rejected",
          verification_error:
            "Transaction does not send BTC to the configured deposit address.",
        })
        .eq("id", depositId)
        .eq("user_id", user.id);

      return NextResponse.json(
        {
          error:
            "This transaction does not send BTC to the deposit address provided by the platform.",
        },
        { status: 400 },
      );
    }

    // -----------------------------------------
    // 14. Calculate BTC amount
    // -----------------------------------------

    // Blockstream returns Bitcoin amounts in satoshis.
    const totalSatoshis = matchingOutputs.reduce(
      (total, output) => total + output.value,
      0,
    );

    const verifiedAmount = totalSatoshis / 100_000_000;

    if (verifiedAmount <= 0) {
      await adminSupabase
        .from("deposits")
        .update({
          verification_status: "rejected",
          verification_error: "The verified Bitcoin amount is invalid.",
        })
        .eq("id", depositId)
        .eq("user_id", user.id);

      return NextResponse.json(
        {
          error: "The verified Bitcoin amount is invalid.",
        },
        { status: 400 },
      );
    }

    // -----------------------------------------
    // 15. Compare requested amount with received amount
    // -----------------------------------------

    const requestedAmount = Number(deposit.amount);

    const isPartialDeposit = verifiedAmount < requestedAmount;
    const isOverpayment = verifiedAmount > requestedAmount;

    // -----------------------------------------
    // 16. Save verified information
    // -----------------------------------------

    const { error: updateError } = await adminSupabase
      .from("deposits")
      .update({
        transaction_hash: transactionHash,
        verified_amount: verifiedAmount,
        verified_at: new Date().toISOString(),
        verification_status: "verified",
        verification_error: null,
      })
      .eq("id", depositId)
      .eq("user_id", user.id)
      .eq("status", "pending");

    if (updateError) {
      console.error("Could not save verification result:", updateError);

      return NextResponse.json(
        {
          error: "Could not save verification result.",
        },
        { status: 500 },
      );
    }

    // -----------------------------------------
    // 17. Atomically credit the BTC balance
    // -----------------------------------------

    const { data: completedDeposit, error: completionError } =
      await adminSupabase.rpc("complete_verified_crypto_deposit", {
        p_deposit_id: depositId,
      });

    if (completionError) {
      console.error("Deposit completion error:", completionError);

      return NextResponse.json(
        {
          error:
            "The transaction was verified, but the deposit could not be completed. Your funds were not credited.",
        },
        { status: 500 },
      );
    }

    // -----------------------------------------
    // 18. Success
    // -----------------------------------------

    let message = "";

    if (isPartialDeposit) {
      message = `You requested ${requestedAmount} BTC, but we received ${verifiedAmount} BTC. Your account has been credited with ${verifiedAmount} BTC.`;
    } else if (isOverpayment) {
      message = `You requested ${requestedAmount} BTC, but we received ${verifiedAmount} BTC. Your account has been credited with ${verifiedAmount} BTC.`;
    } else {
      message = `Your ${verifiedAmount} BTC deposit has been verified and credited to your account.`;
    }

    return NextResponse.json({
      success: true,
      status: "completed",
      transactionHash,
      requestedAmount,
      verifiedAmount,
      partial: isPartialDeposit,
      overpayment: isOverpayment,
      asset: "BTC",
      deposit: completedDeposit,
      message,
    });
  } catch (error) {
    console.error("Bitcoin verification error:", error);

    return NextResponse.json(
      {
        error: "An unexpected verification error occurred.",
      },
      { status: 500 },
    );
  }
}