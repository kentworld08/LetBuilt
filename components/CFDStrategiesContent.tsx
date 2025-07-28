import Image from "next/image";
import Link from "next/link";

export function CFDStrategiesContent() {
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8">
            <span className="text-orange-500">CFD</span> STRATEGIES
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm md:text-base">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span>CFD STRATEGIES</span>
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

              {/* Content Section - Exact text from original */}
              <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-orange-500">
                    LetBuilt
                  </h2>
                </div>

                {/* Introduction */}
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

      {/* Three Strategies Section */}
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
              {/* Strategy 1: Focus on Small Number of Markets */}
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
                      <p>
                        With so many different markets available to trade with
                        CFDs you might be tempted to try them all. This often
                        process to be a recipe for disaster. Instead put your
                        focus on no more than three markets initially and you`ll
                        be able to improve more quickly.
                      </p>
                      <p>
                        If you focus on a small number of markets you will have
                        time to research each of the markets in depth each day.
                        You`ll be able to place small trades in at least one and
                        perhaps all each day as well. And with each passing day
                        and each new trade you`ll learn more about what makes
                        that market tick.
                      </p>
                      <p>
                        You`ll see what the normal volumes are, you`ll find out
                        if the market moves more at certain times of the day,
                        and you`ll learn which economic reports are likely to
                        move the markets. This is the best strategy if you want
                        to become an expert in any given market.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategy 2: Decide Timeframe */}
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
                    <div className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg space-y-4">
                      <p>
                        Some traders love the excitement that comes from trading
                        very short time frames, but others can`t stand the
                        stress of making split second decisions, and prefer to
                        trade longer time frames.
                      </p>
                      <p>
                        Decide when you begin trading if you`ll be a long term
                        trader who focuses on weekly and monthly time frames, or
                        a short term trader who focuses on daily, or even moves
                        that can occur in minutes.
                      </p>
                      <p>
                        By utilizing this strategy you`ll be a more relaxed
                        trader and a more confident trader as you follow your
                        own personality traits rather than trying to fight your
                        natural tendencies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategy 3: Have a Trading Plan */}
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
                    <div className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg space-y-4">
                      <p>
                        It`s critically important that you don`t just jump into
                        the markets without a plan. Before placing any trade you
                        should have already completed your daily research and
                        know whether you want to go long or short, why you`re
                        planning on going long or short, where you`ll enter and
                        exit your trade, and how much capital you`ll risk on
                        each trade.
                      </p>
                      <p>
                        By having all of this decided in advance you can avoid
                        putting your capital at greater risk than you`re willing
                        to accept. You are also more likely to avoid mistakes
                        that many traders make when they trade without a plan,
                        most notably those related to greed and fear.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conclusion Section */}
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

      {/* Strategy Benefits */}
      <div className="bg-gray-800 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
              Why These <span className="text-orange-500">Strategies</span> Work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: "🎯",
                title: "Focused Approach",
                description:
                  "Concentrating on fewer markets allows for deeper understanding and better decision making",
              },
              {
                icon: "⏰",
                title: "Personal Timeframe",
                description:
                  "Trading according to your personality reduces stress and improves consistency",
              },
              {
                icon: "📋",
                title: "Structured Planning",
                description:
                  "Having a clear plan eliminates emotional decisions and protects your capital",
              },
            ].map((benefit, index) => (
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
