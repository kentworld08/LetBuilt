import FallbackImage from "@/lib/FallBackImage";
import HeroBanner from "@/lib/HeroBanner";

export function AffiliateContent() {
  return (
    <div className="bg-gray-900 text-white">
      <HeroBanner title1="Affiliate" title2="Program" sub="Affiliate Program" />

      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative max-w-md mx-auto lg:max-w-none">
                <FallbackImage
                  alt="Forex Trading"
                  url="https://images.unsplash.com/photo-1605902711622-cfb43c4437f9"
                  fallback="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop"
                />

                <div className="absolute -bottom-4 -right-4 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg md:text-xl lg:text-2xl">
                    💰
                  </span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-500">
                Earn with Us
              </h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                Our Affiliate Program rewards clients and partners who help grow
                our network. Each registered user receives a unique affiliate
                link — simply share it, and you`ll earn commissions every time
                your referral makes a deposit.
              </p>
              <ul className="list-disc list-inside text-gray-300 text-base md:text-lg space-y-2">
                <li>No active deposit required to earn.</li>
                <li>Track sign-ups and commissions in your dashboard.</li>
                <li>Withdraw earnings or reinvest anytime.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Affiliate <span className="text-orange-500">Rewards</span>
          </h2>
          <p className="text-gray-300 text-base md:text-lg mb-10">
            You`ll be rewarded for both registration and investment activity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-lg p-6 shadow hover:bg-gray-700 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">
                💵 7% Commission
              </h3>
              <p className="text-gray-300">
                Earn 7% from every deposit made by your referral — paid
                automatically.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 shadow hover:bg-gray-700 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">
                🎉 $2 Signup Bonus
              </h3>
              <p className="text-gray-300">
                Get a $2 bonus for every new user that registers through your
                link.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
