"use client";

import Image from "next/image";
import Link from "next/link";

export function ForexTradingContent() {
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8">
            <span className="text-orange-500">FOREX</span> TRADING
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm md:text-base">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span>FOREX TRADING</span>
          </div>
        </div>

        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particles-container">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${8 + Math.random() * 12}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
              {/* Image Section */}
              <div className="order-2 lg:order-1">
                <div className="relative max-w-md mx-auto lg:max-w-none">
                  <Image
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop"
                    alt="Forex Trading"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-2xl w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop";
                    }}
                  />
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg md:text-xl lg:text-2xl">
                      $
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Section - Exact text from original */}
              <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-orange-500">
                    LetBuilt
                  </h2>
                </div>

                {/* What is Forex Trading - Exact text */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                    What is Forex Trading?
                  </h3>
                  <div className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-md space-y-4">
                    <p>
                      Forex trading is the act of buying one currency while
                      simultaneously selling another currency, with the aim of
                      profiting from the changes in the values of these two
                      currencies over time. Of course forex trading can also
                      lead to losses, which makes it a risky venture and one
                      that should be examined closely before committing any
                      actual trading capital.
                    </p>

                    <p>
                      One benefit of forex trading is the huge volumes traded in
                      forex markets each day, which eliminates any liquidity
                      issues, at least for the currencies of the largest
                      economies. Another benefit to forex trading is that anyone
                      can participate with just a small initial investment.
                    </p>

                    <p>
                      There is a tradeoff however. The small capital
                      requirements in trading forex are due to the use of
                      leverage when trading forex. This means that an investor
                      can control $10,000 worth of currencies with an investment
                      of as little as $25. While this can generate profits more
                      rapidly, it can also lead to losses more rapidly and if
                      the traders account is small they may soon find themselves
                      the victim of a margin call and the loss of all their
                      trading capital.
                    </p>

                    <p>
                      The knowledge and skill required to successfully trade
                      forex makes it anything but simple. Those considering
                      forex trading should be sure that they have sufficient
                      capital and that they are able to withstand the risks
                      presented by forex trading, which include the potential
                      loss of all your trading capital.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="bg-gray-800 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
              Why Trade <span className="text-orange-500">Forex</span> with
              LetBuilt?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base lg:text-lg">
              Experience professional forex trading with our advanced platform
              and expert support
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: "💱",
                title: "Major Currency Pairs",
                description:
                  "Trade the most liquid currency pairs including EUR/USD, GBP/USD, USD/JPY and more",
              },
              {
                icon: "📊",
                title: "Advanced Charts",
                description:
                  "Professional charting tools with technical indicators and real-time market data",
              },
              {
                icon: "⚡",
                title: "Fast Execution",
                description:
                  "Lightning-fast order execution with minimal slippage and competitive spreads",
              },
              {
                icon: "🛡️",
                title: "Risk Management",
                description:
                  "Built-in risk management tools including stop-loss and take-profit orders",
              },
              {
                icon: "📱",
                title: "Mobile Trading",
                description:
                  "Trade on the go with our mobile-optimized platform and dedicated apps",
              },
              {
                icon: "🎓",
                title: "Educational Resources",
                description:
                  "Comprehensive learning materials and market analysis to improve your trading",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg p-6 md:p-8 text-center hover:bg-gray-700 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl"
              >
                <div className="text-3xl md:text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trading Stats */}
      <div className="bg-gray-900 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Forex Market <span className="text-orange-500">Statistics</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { value: "$6.6T", label: "DAILY TRADING VOLUME" },
              { value: "24/5", label: "MARKET HOURS" },
              { value: "180+", label: "CURRENCY PAIRS" },
              { value: "0.1", label: "MINIMUM LOT SIZE" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2 md:space-y-3">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-500">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-xs md:text-sm lg:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
