import Link from "next/link";
import React from "react";
import Animated from "./animated";

interface Props {
  title1: string;
  title2: string;
  sub: string;
}

const HeroBanner = ({ title1, title2, sub }: Props) => {
  return (
    <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-16 md:py-24 lg:py-32">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8">
          <span className="text-orange-500"> {title1}</span>&nbsp;{title2}
        </h1>
        <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm md:text-base">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span>{sub}</span>
        </div>
      </div>

      {/* Animated particles background */}
      <Animated />
    </div>
  );
};

export default HeroBanner;
