import { useQuery } from "@tanstack/react-query";

type BtcPriceResponse = {
  bitcoin: number;
};

export function useBtcPrice() {
  return useQuery<BtcPriceResponse>({
    queryKey: ["btc-price"],
    queryFn: async () => {
      const response = await fetch("/api/crypto/price");

      if (!response.ok) {
        throw new Error("Failed to fetch BTC price");
      }

      return response.json();
    },
  });
}
