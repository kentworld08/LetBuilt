import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { requireAdmin } from "@/utils/supabase/admin-auth";

export async function GET() {
  try {
    await requireAdmin();

    const supabase = createAdminClient();

    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from("withdrawals")
      .select(
        `
          id,
          user_id,
          asset,
          network,
          amount,
          withdrawal_address,
          memo_tag,
          status,
          transaction_hash,
          admin_notes,
          created_at,
          updated_at,
          processed_at,
          completed_at
        `,
      )
      .order("created_at", { ascending: false });

    if (withdrawalsError) {
      console.error("Admin withdrawals error:", withdrawalsError);

      return NextResponse.json(
        { error: "Failed to load withdrawals" },
        { status: 500 },
      );
    }

    if (!withdrawals || withdrawals.length === 0) {
      return NextResponse.json([]);
    }

    const userIds = [
      ...new Set(withdrawals.map((withdrawal) => withdrawal.user_id)),
    ];

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, full_name, username")
      .in("user_id", userIds);

    if (profilesError) {
      console.error("Admin profiles error:", profilesError);

      return NextResponse.json(
        { error: "Failed to load customer information" },
        { status: 500 },
      );
    }

    const { data: assetBalances, error: assetBalancesError } = await supabase
      .from("asset_balances")
      .select("user_id, asset, balance, reserved_balance")
      .in("user_id", userIds);

    if (assetBalancesError) {
      console.error("Admin asset balances error:", assetBalancesError);

      return NextResponse.json(
        { error: "Failed to load customer balances" },
        { status: 500 },
      );
    }

    const profileMap = new Map(
      (profiles ?? []).map((profile) => {
        const customerName =
          profile.full_name?.trim() ||
          profile.username?.trim() ||
          "Unknown customer";

        return [profile.user_id, customerName];
      }),
    );

    const assetBalanceMap = new Map(
      (assetBalances ?? []).map((assetBalance) => {
        const balance = Number(assetBalance.balance);

        const reservedBalance = Number(assetBalance.reserved_balance);

        return [
          `${assetBalance.user_id}:${assetBalance.asset}`,
          {
            balance,
            reservedBalance,
            remainingBalance: balance - reservedBalance,
          },
        ];
      }),
    );

    const result = withdrawals.map((withdrawal) => {
      const balanceInfo = assetBalanceMap.get(
        `${withdrawal.user_id}:${withdrawal.asset}`,
      );

      return {
        id: withdrawal.id,

        customer_name: profileMap.get(withdrawal.user_id) || "Unknown customer",

        asset: withdrawal.asset,
        network: withdrawal.network,

        // Amount requested for this withdrawal
        request_balance: Number(withdrawal.amount),

        // User's current total balance
        current_balance: balanceInfo?.balance ?? 0,

        // Balance remaining after this request
        remaining_balance:
          balanceInfo?.balance !== undefined
            ? balanceInfo.balance - Number(withdrawal.amount)
            : 0,

        withdrawal_address: withdrawal.withdrawal_address,

        memo_tag: withdrawal.memo_tag,

        status: withdrawal.status,

        transaction_hash: withdrawal.transaction_hash,

        admin_notes: withdrawal.admin_notes,

        created_at: withdrawal.created_at,

        updated_at: withdrawal.updated_at,

        processed_at: withdrawal.processed_at,

        completed_at: withdrawal.completed_at,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("Admin withdrawals API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
