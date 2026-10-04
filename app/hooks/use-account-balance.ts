import { useMemo } from "react";
import { useAssetBalances } from "@/app/hooks/use-asset-balances";
import { useCryptoPrices } from "@/app/hooks/use-crypto-prices";

const assetPriceKey = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  USDC: "usd_coin",
} as const;

export function useAccountBalance() {
  const {
    data: assetBalances = [],
    isLoading: isAssetsLoading,
    error: assetsError,
  } = useAssetBalances();

  const {
    data: prices,
    isLoading: isPricesLoading,
    error: pricesError,
  } = useCryptoPrices();

  const balance = useMemo(() => {
    // If we don't have prices yet, don't calculate
    // an incorrect $0 balance.
    if (!prices) {
      return undefined;
    }

    return assetBalances.reduce((total, asset) => {
      const assetSymbol = asset.asset.toUpperCase();

      const priceKey = assetPriceKey[assetSymbol as keyof typeof assetPriceKey];

      if (!priceKey) {
        return total;
      }

      const price = Number(prices[priceKey] ?? 0);

      return total + asset.available_balance * price;
    }, 0);
  }, [assetBalances, prices]);

  return {
    data: balance,
    isLoading: isAssetsLoading || isPricesLoading,
    error: assetsError || pricesError,
  };
}
