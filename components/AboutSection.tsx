import { Button } from "@/components/ui/button";
import Image from "next/image";

export function AboutSection() {
  return (
    <div className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            ABOUT <span className="text-orange-500">US</span>
          </h2>
          <p className="text-gray-300 text-base md:text-lg">
            MOST FLEXIBLE CRYPTOCURRENCY INVESTMENT COMPANY
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center">
            <Image
              src="/certification.png"
              alt="certification"
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>

          <div className="space-y-4 md:space-y-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                Our Mission
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                Our Mission Is To Bring Trading To The Masses. We do so by
                providing an intuitive trading platform designed with the latest
                technological advancements that`s geared towards new traders as
                well as professionals. We place great emphasis on education,
                providing a well-rounded library of V.O.D. seminars, webinars,
                daily news, analysis and more. Our customer service and support
                is always available to meet your needs, and our account managers
                know that your success is our success.
              </p>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                Our Vision
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                LetBuilt was established as a way for traders to invest in the
                financial markets on a platform that is user friendly. Your
                success is a testament of our commitment to any investor who
                chooses to trade with Valuace. That is why we strive to provide
                you with an expanding asset selection, dedicated support and
                personal assistance.
              </p>
            </div>
            <Button className="mt-4 md:mt-6">Read More</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
