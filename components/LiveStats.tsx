"use client";

import { useQuery } from "@tanstack/react-query";

// Mock market stats function
const fetchMarketStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return {
    active_cryptocurrencies: 10847,
    markets: 1058,
    total_market_cap: {
      usd: 2650000000000,
    },
    total_volume: {
      usd: 89500000000,
    },
    market_cap_percentage: {
      btc: 51.5,
    },
  };
};

export function LiveStats() {
  const {
    data: marketData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["live-market-stats"],
    queryFn: fetchMarketStats,
  });

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toFixed(0);
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg">
        Failed to load market data
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-white text-lg font-semibold mb-4">
        Live Market Stats
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-bold text-orange-500">
            {isLoading ? (
              <div className="animate-pulse bg-gray-700 h-8 w-24 rounded"></div>
            ) : (
              `$${formatNumber(marketData?.total_market_cap?.usd || 0)}`
            )}
          </div>
          <div className="text-gray-400 text-sm">TOTAL MARKET CAP</div>
          <div className="text-2xl font-bold text-orange-500 mt-2">
            {isLoading ? (
              <div className="animate-pulse bg-gray-700 h-8 w-16 rounded"></div>
            ) : (
              formatNumber(marketData?.active_cryptocurrencies || 0)
            )}
          </div>
          <div className="text-gray-400 text-sm">ACTIVE CRYPTOCURRENCIES</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-orange-500">
            {isLoading ? (
              <div className="animate-pulse bg-gray-700 h-8 w-20 rounded"></div>
            ) : (
              `$${formatNumber(marketData?.total_volume?.usd || 0)}`
            )}
          </div>
          <div className="text-gray-400 text-sm">24H VOLUME</div>
          <div className="text-2xl font-bold text-orange-500 mt-2">
            {isLoading ? (
              <div className="animate-pulse bg-gray-700 h-8 w-12 rounded"></div>
            ) : (
              formatNumber(marketData?.markets || 0)
            )}
          </div>
          <div className="text-gray-400 text-sm">ACTIVE MARKETS</div>
        </div>
      </div>
      {!isLoading && (
        <div className="mt-4 text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
