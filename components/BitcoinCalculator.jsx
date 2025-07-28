"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchExchangeRates } from "@/lib/api";

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "NZD", name: "New Zealand Dollar" },
];

export function BitcoinCalculator() {
  const [btcValue, setBtcValue] = useState("1");
  const [currencyValue, setCurrencyValue] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  // Fetch exchange rates
  const {
    data: exchangeData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: fetchExchangeRates,
  });

  useEffect(() => {
    if (exchangeData?.bitcoin) {
      const currencyKey = selectedCurrency.toLowerCase();
      const rate = exchangeData.bitcoin[currencyKey];
      if (rate) {
        const calculated = (Number.parseFloat(btcValue) * rate).toFixed(2);
        setCurrencyValue(calculated);
      }
    }
  }, [btcValue, selectedCurrency, exchangeData]);

  const handleBtcChange = (value) => {
    setBtcValue(value);
  };

  const handleCurrencyChange = (value) => {
    if (exchangeData?.bitcoin) {
      const currencyKey = selectedCurrency.toLowerCase();
      const rate = exchangeData.bitcoin[currencyKey];
      if (rate) {
        const btcAmount = (Number.parseFloat(value) / rate).toFixed(8);
        setBtcValue(btcAmount);
      }
    }
    setCurrencyValue(value);
  };

  return (
    <div className="relative bg-gray-900 py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            <span className="text-orange-500">BITCOIN</span> CALCULATOR
          </h2>
          <p className="text-gray-300 mb-8">
            FIND OUT THE CURRENT BITCOIN VALUE WITH OUR EASY-TO-USE CONVERTER
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg mb-6">
              Failed to load exchange rates. Please try again later.
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="relative">
              <input
                type="number"
                value={btcValue}
                onChange={(e) => handleBtcChange(e.target.value)}
                className="w-32 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500">
                ₿
              </div>
            </div>

            <div className="text-white text-2xl">=</div>

            <div className="relative">
              <input
                type="number"
                value={currencyValue}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-40 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                disabled={isLoading}
              />
            </div>

            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
              disabled={isLoading}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>

          <div className="text-gray-400 text-sm space-y-1">
            <p>* Data updated every minute from CoinGecko API</p>
            {isLoading && (
              <p className="text-orange-500">Loading live rates...</p>
            )}
            {exchangeData?.bitcoin && (
              <p className="text-green-400">
                Live Rate: 1 BTC ={" "}
                {exchangeData.bitcoin[
                  selectedCurrency.toLowerCase()
                ]?.toLocaleString()}{" "}
                {selectedCurrency}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
