import { useQuery } from "@tanstack/react-query";

export type CryptoPrices = {
  bitcoin: number;
  ethereum: number;
  tether: number;
  usd_coin: number;
};

export function useCryptoPrices() {
  return useQuery<CryptoPrices>({
    queryKey: ["crypto-prices"],

    queryFn: async () => {
      const response = await fetch("/api/crypto/price");

      if (!response.ok) {
        throw new Error("We couldn't load crypto prices.");
      }

      const data = await response.json();

      return {
        bitcoin: Number(data.bitcoin ?? 0),
        ethereum: Number(data.ethereum ?? 0),
        tether: Number(data.tether ?? 0),
        usd_coin: Number(data.usd_coin ?? 0),
      };
    },

    // Prices do not need to be requested every 5 seconds.
    staleTime: 60 * 1000,

    // Refresh prices every 60 seconds.
    refetchInterval: 60 * 1000,

    // Try once more if a request fails.
    retry: 1,

    // If CoinGecko fails, keep the last successful
    // price data available to the UI.
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
