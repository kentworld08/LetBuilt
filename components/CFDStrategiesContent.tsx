import HeroBanner from "@/lib/HeroBanner";
import Image from "next/image";
import {
  CFDStrategies,
  timeFrames,
  tradingPlans,
  CFDStrategy,
} from "@/constants/Data";

export function CFDStrategiesContent() {
  return (
    <div className="bg-gray-900 text-white">
      <HeroBanner title1="CFD" title2="STRATEGIES" sub="CFD STRATEGIES" />

      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
              <div className="order-2 lg:order-1">
                <div className="relative max-w-md mx-auto lg:max-w-none">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
                    alt="CFD Strategies"
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
                      🎯
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
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg">
                    These three simple strategies are below:
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
                Three Essential{" "}
                <span className="text-orange-500">CFD Strategies</span>
              </h2>
              <p className="text-gray-300 text-sm md:text-base lg:text-lg">
                Master these fundamental strategies for successful CFD trading
              </p>
            </div>

            <div className="space-y-8 md:space-y-12">
              <div className="bg-gray-900 rounded-lg p-6 md:p-8 lg:p-10">
                <div className="flex items-start space-x-4 md:space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg md:text-xl">
                      1
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                      Focus on a small number of markets
                    </h3>
                    <div className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg space-y-4">
                      {CFDStrategies.map((strategy, index) => (
                        <p key={index}>{strategy}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 md:p-8 lg:p-10">
                <div className="flex items-start space-x-4 md:space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg md:text-xl">
                      2
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                      Decide what timeframe is best for you
                    </h3>
                    <div className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-md space-y-4">
                      {timeFrames.map((timeFrame, index) => (
                        <p key={index}>{timeFrame}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 md:p-8 lg:p-10">
                <div className="flex items-start space-x-4 md:space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg md:text-xl">
                      3
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                      Have a trading plan
                    </h3>
                    <div className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-md space-y-4">
                      {tradingPlans.map((tradingPlan, index) => (
                        <p key={index}>{tradingPlan}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-800 rounded-lg p-6 md:p-8 lg:p-10">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-6">
                Your Foundation for{" "}
                <span className="text-orange-500">Trading Success</span>
              </h3>
              <div className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg space-y-4">
                <p>
                  These three basic strategies are not only enough to get you
                  started in trading CFDs, they will also serve you well for
                  your entire trading career.
                </p>
                <p>
                  Always keep them in mind and if you stray from them focus on
                  getting back to the basic strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
              Why These <span className="text-orange-500">Strategies</span> Work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {CFDStrategy.map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg p-6 md:p-8 text-center hover:bg-gray-700 transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
