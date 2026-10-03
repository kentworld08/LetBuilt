import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export function useAccountBalance() {
  return useQuery<number>({
    queryKey: ["account-balance"],
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
        .from("account_balances")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (error) {
        throw new Error("We couldn't load your account balance.");
      }

      return Number(data.balance);
    },
  });
}