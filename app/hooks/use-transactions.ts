import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

type Transaction = {
  id: string;
  type: "deposit" | "withdrawal" | "trade" | "adjustment";
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "cancelled" | "reversed";
  description: string | null;
  created_at: string;
};

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
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
        .from("transactions")
        .select("id, type, amount, currency, status, description, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        throw new Error("We couldn't load your transactions.");
      }

      return (data ?? []).map((transaction) => ({
        ...transaction,
        amount: Number(transaction.amount),
      }));
    },
  });
}
