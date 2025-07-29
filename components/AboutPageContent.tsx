import HeroBanner from "@/lib/HeroBanner";
import MissionVission from "./mission-vission";

export function AboutPageContent() {
  return (
    <div className="bg-gray-900 text-white">
      <HeroBanner title1="About" title2="LetBuilt" sub="ABOUT US" />

      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="gap-8 md:gap-12 lg:gap-16 items-start">
              <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-orange-500">
                    LetBuilt
                  </h2>
                </div>

                <MissionVission />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
