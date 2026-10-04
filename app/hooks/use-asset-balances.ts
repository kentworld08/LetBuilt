import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

type AssetBalance = {
  id: string;
  asset: string;
  balance: number;
  reserved_balance: number;
  available_balance: number;
};

export function useAssetBalances() {
  return useQuery<AssetBalance[]>({
    queryKey: ["asset-balances"],

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
        .from("asset_balances")
        .select("id, asset, balance, reserved_balance")
        .eq("user_id", user.id)
        .order("asset", { ascending: true });

      if (error) {
        throw new Error("We couldn't load your crypto balances.");
      }

      return (data ?? []).map((asset) => {
        const balance = Number(asset.balance);
        const reservedBalance = Number(asset.reserved_balance);

        return {
          id: asset.id,
          asset: asset.asset,
          balance,
          reserved_balance: reservedBalance,
          available_balance: balance - reservedBalance,
        };
      });
    },
  });
}
