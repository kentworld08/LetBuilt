// API functions for fetching cryptocurrency data
export interface BitcoinPrice {
  bitcoin: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
    usd_24h_vol: number;
  };
}

export interface CryptoNews {
  id: string;
  title: string;
  description: string;
  url: string;
  published_at: string;
  source: string;
}

export interface MarketStats {
  active_cryptocurrencies: number;
  markets: number;
  total_market_cap: {
    usd: number;
  };
  total_volume: {
    usd: number;
  };
  market_cap_percentage: {
    btc: number;
  };
}

// Fetch Bitcoin price from CoinGecko
export const fetchBitcoinPrice = async (): Promise<BitcoinPrice> => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Bitcoin price");
  }

  return response.json();
};

// Fetch global market stats
export const fetchMarketStats = async (): Promise<MarketStats> => {
  const response = await fetch("https://api.coingecko.com/api/v3/global");

  if (!response.ok) {
    throw new Error("Failed to fetch market stats");
  }

  const data = await response.json();
  return data.data;
};

// Fetch cryptocurrency news
export const fetchCryptoNews = async (): Promise<CryptoNews[]> => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/news?per_page=10"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch crypto news");
  }

  return response.json();
};

// Fetch exchange rates for calculator
export const fetchExchangeRates = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,gbp,jpy,aud,cad,chf,cny,sek,nzd"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  return response.json();
};
