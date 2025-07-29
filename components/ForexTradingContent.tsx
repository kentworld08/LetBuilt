"use client";

import HeroBanner from "@/lib/HeroBanner";
import Image from "next/image";
import { ForexTradingFeatures } from "@/constants/Data";
import { ForexMarket } from "@/constants/Data";
import { ForexTrading } from "@/constants/Data";

export function ForexTradingContent() {
  return (
    <div className="bg-gray-900 text-white">
      <HeroBanner title1="FOREX" title2="TRADING" sub="FOREX TRADING " />

      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
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

              <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-orange-500">
                    LetBuilt
                  </h2>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                    What is Forex Trading?
                  </h3>
                  <div className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-md space-y-4">
                    {ForexTrading.map((forexT, index) => (
                      <p key={index}>{forexT}</p>
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
            {ForexTradingFeatures.map((feature, index) => (
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

      <div className="bg-gray-900 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Forex Market <span className="text-orange-500">Statistics</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
            {ForexMarket.map((stat, index) => (
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
