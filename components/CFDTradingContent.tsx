import HeroBanner from "@/lib/HeroBanner";
import Image from "next/image";
import { CFDTradingFeatures } from "@/constants/Data";
import { CFDTrading } from "@/constants/Data";

export function CFDTradingContent() {
  return (
    <div className="bg-gray-900 text-white">
      <HeroBanner title1="CFD" title2="TRADING LetBuilt" sub="CFD TRADING" />

      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
              <div className="order-2 lg:order-1">
                <div className="relative max-w-md mx-auto lg:max-w-none">
                  <Image
                    src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop"
                    alt="CFD Trading"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-2xl w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop";
                    }}
                  />
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg md:text-xl lg:text-2xl">
                      📊
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-orange-500">
                    LetBuilt
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-md space-y-4">
                    {CFDTrading.map((cfd, index) => (
                      <p key={index}>{cfd}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
                CFD Trading <span className="text-orange-500">Example</span>
              </h2>
              <p className="text-gray-300 text-sm md:text-base lg:text-lg">
                Understanding how CFD trading works in practice
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 md:p-8 lg:p-10">
              <div className="space-y-6">
                <div className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-md space-y-4">
                  <p className="font-semibold text-orange-500">For example:</p>

                  <p>
                    You`ve read a report on Apple that indicates the stock will
                    plummet in the next few days. You then enter our trading
                    platform and watch its behavior on our live, real-time graph
                    and decide you agree.
                  </p>

                  <div className="bg-gray-800 rounded-lg p-4 md:p-6 my-6">
                    <p className="text-white font-semibold mb-4 text-center">
                      Do you Buy? Or Sell?
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-600/20 border border-green-600 rounded-lg p-4 text-center">
                        <h4 className="text-green-400 font-semibold mb-2">
                          BUY
                        </h4>
                        <p className="text-gray-300 text-sm">
                          The stock needs to go up higher than the Buy price
                        </p>
                      </div>
                      <div className="bg-red-600/20 border border-red-600 rounded-lg p-4 text-center">
                        <h4 className="text-red-400 font-semibold mb-2">
                          SELL
                        </h4>
                        <p className="text-gray-300 text-sm">
                          The stock needs to fall lower than the Sell price
                        </p>
                      </div>
                    </div>
                  </div>

                  <p>
                    Has your asset risen by 2 pips beyond the predetermined
                    criteria, or 1? If you predict a sharp change in the asset`s
                    movement during the trade`s time frame then trading a CFD
                    might be your better option. However, there are risks
                    involved, and the potential losses should also be examined.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
              Why Trade <span className="text-orange-500">CFDs</span> with
              LetBuilt?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base lg:text-md">
              Access global markets with lower capital requirements and flexible
              trading options
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {CFDTradingFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-6 md:p-8 text-center hover:bg-gray-700 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl"
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

      <div className="bg-red-900/20 border-t border-red-600 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="text-red-400 text-2xl mr-3">⚠️</div>
              <h3 className="text-xl md:text-2xl font-bold text-red-400">
                Risk Warning
              </h3>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              CFD trading involves significant risk of loss. You should consider
              whether you understand how CFDs work and whether you can afford to
              take the high risk of losing your money. Past performance is not
              indicative of future results. Please ensure you fully understand
              the risks involved before trading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
