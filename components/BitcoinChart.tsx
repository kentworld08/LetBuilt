"use client";

import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock Bitcoin price data - in a real app, this would come from an API
const fetchBitcoinChartData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generate realistic Bitcoin price data for the last 30 days
  const basePrice = 69775;
  const data = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Create realistic price fluctuations
    const randomChange = (Math.random() - 0.5) * 0.1; // ±5% daily change
    const price = basePrice * (1 + randomChange * (i / 30));

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price: Math.round(price),
      volume: Math.round(Math.random() * 50000000000), // Random volume
    });
  }

  return data;
};

export function BitcoinChart() {
  const {
    data: chartData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bitcoin-chart"],
    queryFn: fetchBitcoinChartData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 flex items-center justify-center">
        <div className="text-center text-red-400">
          <div className="text-4xl mb-4">⚠️</div>
          <p>Failed to load chart data</p>
          <p className="text-sm text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading Bitcoin Chart...</p>
          <p className="text-sm text-gray-500 mt-2">
            Fetching live market data
          </p>
        </div>
      </div>
    );
  }

  const currentPrice = chartData?.[chartData.length - 1]?.price || 0;
  const previousPrice = chartData?.[chartData.length - 2]?.price || 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2);

  return (
    <div className="bg-gray-800 rounded-lg p-4 md:p-6">
      {/* Chart Header */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <h3 className="text-white text-lg font-semibold mb-2 sm:mb-0">
            Bitcoin Trading Chart
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-500">
              {formatPrice(currentPrice)}
            </div>
            <div
              className={`text-sm ${
                priceChange >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {priceChange >= 0 ? "+" : ""}
              {formatPrice(priceChange)} ({priceChangePercent}%)
            </div>
          </div>
        </div>
        <p className="text-gray-400 text-sm">30-day price movement</p>
      </div>

      {/* Chart */}
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              fontSize={12}
              tick={{ fill: "#9CA3AF" }}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              tick={{ fill: "#9CA3AF" }}
              tickFormatter={formatPrice}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F9FAFB",
              }}
              formatter={(value: number, name: string) => [
                name === "price" ? formatPrice(value) : formatVolume(value),
                name === "price" ? "Price" : "Volume",
              ]}
              labelStyle={{ color: "#F97316" }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#F97316"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                stroke: "#F97316",
                strokeWidth: 2,
                fill: "#1F2937",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-orange-500 font-bold text-sm">
              {chartData
                ? formatPrice(Math.max(...chartData.map((d) => d.price)))
                : "-"}
            </div>
            <div className="text-gray-400 text-xs">30D High</div>
          </div>
          <div>
            <div className="text-orange-500 font-bold text-sm">
              {chartData
                ? formatPrice(Math.min(...chartData.map((d) => d.price)))
                : "-"}
            </div>
            <div className="text-gray-400 text-xs">30D Low</div>
          </div>
          <div>
            <div className="text-orange-500 font-bold text-sm">
              {chartData
                ? formatVolume(chartData[chartData.length - 1]?.volume || 0)
                : "-"}
            </div>
            <div className="text-gray-400 text-xs">24H Volume</div>
          </div>
          <div>
            <div className="text-orange-500 font-bold text-sm">
              {chartData ? chartData.length : 0}
            </div>
            <div className="text-gray-400 text-xs">Data Points</div>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center justify-center mt-3 pt-3 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-xs">Live Market Data</span>
          <span className="text-gray-500 text-xs">
            Updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}
