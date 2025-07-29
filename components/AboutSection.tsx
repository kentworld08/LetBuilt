import { Button } from "@/components/ui/button";
import Image from "next/image";
import MissionVission from "./mission-vission";

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
            <MissionVission />

            <Button className="mt-4 md:mt-6">Read More</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
