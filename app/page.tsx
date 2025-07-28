"use client";

import { HeroSlider } from "@/components/HeroSlider";
import { ProcessSteps } from "@/components/ProcessSteps";
import { AboutSection } from "@/components/AboutSection";
import { Features } from "@/components/Features";
import { BitcoinCalculator } from "@/components/BitcoinCalculator";
import { Testimonials } from "@/components/Testimonials";
import { CallToAction } from "@/components/CallToAction";

import { NotificationSystem } from "@/components/NotificationSystem";
import { LiveStats } from "@/components/LiveStats";
import { CryptoNews } from "@/components/CryptoNews";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <ProcessSteps />
      <AboutSection />
      <Features />
      <div className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <LiveStats />
            <CryptoNews />
          </div>
        </div>
      </div>
      <BitcoinCalculator />
      <Testimonials />
      <CallToAction />

      <NotificationSystem />
    </div>
  );
}
