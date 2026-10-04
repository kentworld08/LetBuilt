import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export type Withdrawal = {
  id: string;
  asset: string;
  network: string;
  amount: number;
  withdrawal_address: string;
  memo_tag: string | null;
  status: "pending" | "processing" | "completed" | "rejected" | "cancelled";
  transaction_hash: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  processed_at: string | null;
  completed_at: string | null;
};

export function useWithdrawals() {
  return useQuery<Withdrawal[]>({
    queryKey: ["withdrawals"],
    queryFn: async () => {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User is not authenticated");
      }

      const { data, error } = await supabase
        .from("withdrawals")
        .select(
          `
            id,
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
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error("We couldn't load your withdrawal requests.");
      }

      return (data ?? []).map((withdrawal) => ({
        ...withdrawal,
        amount: Number(withdrawal.amount),
      }));
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
