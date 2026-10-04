import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { requireAdmin } from "@/utils/supabase/admin-auth";

type Action = "approve" | "reject" | "complete";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const body = await request.json();
    const action = body.action as Action;

    if (!["approve", "reject", "complete"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid withdrawal action" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data: withdrawal, error: withdrawalError } = await supabase
      .from("withdrawals")
      .select(
        `
          id,
          user_id,
          asset,
          amount,
          status
        `,
      )
      .eq("id", id)
      .single();

    if (withdrawalError || !withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 },
      );
    }

    /* =========================================================
       APPROVE
    ========================================================= */

    if (action === "approve") {
      if (withdrawal.status !== "pending") {
        return NextResponse.json(
          { error: "Only pending withdrawals can be approved" },
          { status: 400 },
        );
      }

      const { error } = await supabase
        .from("withdrawals")
        .update({
          status: "processing",
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("status", "pending");

      if (error) {
        console.error("Approve withdrawal error:", error);

        return NextResponse.json(
          { error: "Failed to approve withdrawal" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Withdrawal approved",
      });
    }

    /* =========================================================
       REJECT
    ========================================================= */

    if (action === "reject") {
      if (withdrawal.status !== "pending") {
        return NextResponse.json(
          { error: "Only pending withdrawals can be rejected" },
          { status: 400 },
        );
      }

      const adminNotes =
        typeof body.admin_notes === "string" ? body.admin_notes.trim() : "";

      if (!adminNotes) {
        return NextResponse.json(
          {
            error: "A rejection reason is required",
          },
          { status: 400 },
        );
      }

      /*
       * The rejection RPC:
       * - locks the withdrawal
       * - releases the reserved balance
       * - marks the withdrawal as rejected
       * - saves the admin rejection reason
       */
      const { error: rpcError } = await supabase.rpc("reject_withdrawal", {
        p_withdrawal_id: id,
        p_admin_notes: adminNotes,
      });

      if (rpcError) {
        console.error("Reject withdrawal error:", rpcError);

        return NextResponse.json(
          {
            error: rpcError.message || "Failed to reject withdrawal",
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Withdrawal rejected",
      });
    }

    /* =========================================================
       COMPLETE
    ========================================================= */

    if (action === "complete") {
      if (withdrawal.status !== "processing") {
        return NextResponse.json(
          {
            error: "Only processing withdrawals can be completed",
          },
          { status: 400 },
        );
      }

      const transactionHash =
        typeof body.transaction_hash === "string"
          ? body.transaction_hash.trim()
          : "";

      if (!transactionHash) {
        return NextResponse.json(
          {
            error: "Transaction ID is required to complete the withdrawal",
          },
          { status: 400 },
        );
      }

      const { error } = await supabase.rpc("complete_withdrawal", {
        p_withdrawal_id: id,
        p_transaction_hash: transactionHash,
      });

      if (error) {
        console.error("Complete withdrawal error:", error);

        return NextResponse.json(
          {
            error: error.message || "Failed to complete withdrawal",
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Withdrawal completed",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("Admin withdrawal action error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
