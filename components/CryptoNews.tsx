"use client";

import { useQuery } from "@tanstack/react-query";

// Mock news data
const mockNews = [
  {
    id: "1",
    title: "Bitcoin Reaches New All-Time High as Institutional Adoption Grows",
    description:
      "Major corporations continue to add Bitcoin to their treasury reserves",
    url: "#",
    published_at: "2024-01-15T10:30:00Z",
    source: "CryptoDaily",
  },
  {
    id: "2",
    title: "Ethereum 2.0 Staking Rewards Hit Record Levels",
    description: "Network upgrades drive increased validator participation",
    url: "#",
    published_at: "2024-01-15T09:15:00Z",
    source: "BlockNews",
  },
  {
    id: "3",
    title: "Central Bank Digital Currencies Gain Momentum Worldwide",
    description: "Multiple countries announce CBDC pilot programs",
    url: "#",
    published_at: "2024-01-15T08:45:00Z",
    source: "FinanceToday",
  },
  {
    id: "4",
    title: "DeFi Protocol Launches Revolutionary Yield Farming Feature",
    description:
      "New automated strategies promise higher returns for liquidity providers",
    url: "#",
    published_at: "2024-01-15T07:20:00Z",
    source: "DeFiPulse",
  },
  {
    id: "5",
    title: "Regulatory Clarity Boosts Crypto Market Confidence",
    description:
      "Clear guidelines from financial authorities drive institutional investment",
    url: "#",
    published_at: "2024-01-15T06:10:00Z",
    source: "RegulatoryWatch",
  },
];

const fetchCryptoNews = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return mockNews;
};

export function CryptoNews() {
  const {
    data: news,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["crypto-news"],
    queryFn: fetchCryptoNews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg">
        Failed to load crypto news
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-white text-lg font-semibold mb-4">
        Latest Crypto News
      </h3>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-hide ">
          {news?.slice(0, 5).map((article) => (
            <div
              key={article.id}
              className="border-b border-gray-700 pb-3 last:border-b-0"
            >
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-orange-500 transition-colors"
              >
                <h4 className="font-medium text-sm mb-1 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-gray-400 text-xs">{article.source}</p>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
