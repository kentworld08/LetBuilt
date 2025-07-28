"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Menu, X, User, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock API functions (since we can't install external packages in this environment)
const fetchBitcoinPrice = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    bitcoin: {
      usd: 69775,
      usd_24h_change: 2.5,
      usd_market_cap: 1365000000000,
      usd_24h_vol: 28500000000,
    },
  };
};

const fetchMarketStats = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
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

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch Bitcoin price
  const { data: bitcoinData, isLoading: bitcoinLoading } = useQuery({
    queryKey: ["bitcoin-price"],
    queryFn: fetchBitcoinPrice,
  });

  // Fetch market stats
  const { data: marketData, isLoading: marketLoading } = useQuery({
    queryKey: ["market-stats"],
    queryFn: fetchMarketStats,
  });

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toFixed(0);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <>
      {/* Top Header */}
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between py-3 lg:hidden">
            {/* Mobile Logo */}
            <div className="relative h-8 w-32">
              <Image
                src="/logo.png"
                alt="LetBuilt"
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between py-4">
            {/* Desktop Logo */}
            <div className="relative h-12 w-48">
              <Image
                src="/logo.png"
                alt="LetBuilt"
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Live Stats - Desktop Only */}
            <div className="flex items-center space-x-6 text-sm flex-1 justify-center">
              <div className="text-center">
                <div className="text-orange-500 font-bold text-xs">
                  {marketLoading ? (
                    <div className="animate-pulse bg-gray-700 h-4 w-16 rounded"></div>
                  ) : (
                    formatCurrency(marketData?.total_market_cap?.usd || 0)
                  )}
                </div>
                <div className="text-gray-400 text-xs">Market Cap</div>
              </div>
              <div className="text-center">
                <div
                  className={`font-bold text-xs ${
                    (bitcoinData?.bitcoin?.usd_24h_change || 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {bitcoinLoading ? (
                    <div className="animate-pulse bg-gray-700 h-4 w-12 rounded"></div>
                  ) : (
                    `${(bitcoinData?.bitcoin?.usd_24h_change || 0).toFixed(2)}%`
                  )}
                </div>
                <div className="text-gray-400 text-xs">24h Change</div>
              </div>
              <div className="text-center">
                <div className="text-orange-500 font-bold text-xs">
                  {marketLoading ? (
                    <div className="animate-pulse bg-gray-700 h-4 w-16 rounded"></div>
                  ) : (
                    formatNumber(marketData?.total_volume?.usd || 0)
                  )}
                </div>
                <div className="text-gray-400 text-xs">24h Volume</div>
              </div>
              <div className="text-center">
                <div className="text-orange-500 font-bold text-xs">
                  {marketLoading ? (
                    <div className="animate-pulse bg-gray-700 h-4 w-12 rounded"></div>
                  ) : (
                    formatNumber(marketData?.markets || 0)
                  )}
                </div>
                <div className="text-gray-400 text-xs">Active Markets</div>
              </div>
              <div className="text-center">
                <div className="text-orange-500 font-bold text-xs">
                  {bitcoinLoading ? (
                    <div className="animate-pulse bg-gray-700 h-4 w-20 rounded"></div>
                  ) : (
                    formatCurrency(bitcoinData?.bitcoin?.usd || 0)
                  )}
                </div>
                <div className="text-gray-400 text-xs">Live Bitcoin Price</div>
              </div>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-3 bg-transparent"
              >
                <User size={14} className="mr-1" />
                SIGN IN
              </Button>
              <Button variant="v2" size="sm" className="text-xs px-3">
                <UserPlus size={14} className="mr-1" />
                REGISTER
              </Button>
            </div>
          </div>

          {/* Mobile Stats - Only shown when menu is closed */}
          <div
            className={`lg:hidden border-t border-gray-700 py-2 ${
              isMenuOpen ? "hidden" : "block"
            }`}
          >
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center">
                <div className="text-orange-500 font-bold">
                  {bitcoinLoading
                    ? "Loading..."
                    : formatCurrency(bitcoinData?.bitcoin?.usd || 0)}
                </div>
                <div className="text-gray-400">BTC Price</div>
              </div>
              <div className="text-center">
                <div
                  className={`font-bold ${
                    (bitcoinData?.bitcoin?.usd_24h_change || 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {bitcoinLoading
                    ? "Loading..."
                    : `${(bitcoinData?.bitcoin?.usd_24h_change || 0).toFixed(
                        2
                      )}%`}
                </div>
                <div className="text-gray-400">24h Change</div>
              </div>
            </div>
          </div>

          {/* Mobile Auth Buttons - Only shown when menu is open */}
          <div
            className={`lg:hidden border-t border-gray-700 py-3 ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="text-sm bg-transparent w-full"
              >
                <User size={16} className="mr-2" />
                SIGN IN
              </Button>
              <Button variant="v2" size="sm" className="text-sm w-full">
                <UserPlus size={16} className="mr-2" />
                REGISTER
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className={`${isMenuOpen ? "block" : "hidden"} lg:block`}>
            <ul className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 py-4">
              <li>
                <a
                  href="#"
                  className="block py-2 lg:py-0 text-orange-500 font-medium text-sm lg:text-base"
                >
                  HOME
                </a>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block py-2 lg:py-0 hover:text-orange-500 transition-colors text-sm lg:text-base"
                >
                  ABOUT US
                </Link>
              </li>
              <li className="relative group">
                <a
                  href="#"
                  className="block py-2 lg:py-0 hover:text-orange-500 transition-colors text-sm lg:text-base"
                >
                  FOREX/CDFS
                </a>
                <ul className="lg:absolute top-full left-0 bg-gray-700 lg:rounded-md lg:shadow-lg opacity-100 lg:opacity-0 visible lg:invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-48 z-50 pl-4 lg:pl-0">
                  <li>
                    <a
                      href="#"
                      className="block px-0 lg:px-4 py-1 lg:py-2 hover:bg-transparent lg:hover:bg-gray-600 text-xs lg:text-sm"
                    >
                      FOREX TRADING
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-0 lg:px-4 py-1 lg:py-2 hover:bg-transparent lg:hover:bg-gray-600 text-xs lg:text-sm"
                    >
                      CFD TRADING
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-0 lg:px-4 py-1 lg:py-2 hover:bg-transparent lg:hover:bg-gray-600 text-xs lg:text-sm"
                    >
                      CFD STRATEGIES
                    </a>
                  </li>
                </ul>
              </li>
              <li className="relative group">
                <a
                  href="#"
                  className="block py-2 lg:py-0 hover:text-orange-500 transition-colors text-sm lg:text-base"
                >
                  LEGAL
                </a>
                <ul className="lg:absolute top-full left-0 bg-gray-700 lg:rounded-md lg:shadow-lg opacity-100 lg:opacity-0 visible lg:invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-48 z-50 pl-4 lg:pl-0">
                  <li>
                    <a
                      href="#"
                      className="block px-0 lg:px-4 py-1 lg:py-2 hover:bg-transparent lg:hover:bg-gray-600 text-xs lg:text-sm"
                    >
                      TERMS & CONDITIONS
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-0 lg:px-4 py-1 lg:py-2 hover:bg-transparent lg:hover:bg-gray-600 text-xs lg:text-sm"
                    >
                      FAQS
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 lg:py-0 hover:text-orange-500 transition-colors text-sm lg:text-base"
                >
                  CONTACT US
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 lg:py-0 hover:text-orange-500 transition-colors text-sm lg:text-base"
                >
                  AFFILIATE
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
