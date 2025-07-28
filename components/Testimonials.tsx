"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BitcoinChart } from "./BitcoinChart";

const testimonials = [
  {
    id: 1,
    name: "Jack Mill",
    role: "Market analyst",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    comment:
      "LetBuilt has revolutionized my trading experience. The platform's intuitive design and real-time data have helped me make informed decisions and maximize my profits.",
  },
  {
    id: 2,
    name: "Michael Pete",
    role: "Forex analyst",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    comment:
      "The advanced analytics and market insights provided by LetBuilt are unmatched. I've seen consistent growth in my portfolio since joining this platform.",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Crypto trader",
    image: "/update_1581806843.jpg",
    comment:
      "As a beginner in cryptocurrency trading, LetBuilt's educational resources and user-friendly interface made it easy for me to start trading confidently.",
  },
];

export function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            WHAT OUR <span className="text-orange-500">CLIENTS SAY</span>
          </h2>
          <p className="text-gray-300">
            Real feedback from our trading community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Testimonials */}
          <div className="bg-gray-800 rounded-lg p-6 md:p-8">
            <div className="relative h-48 md:h-64">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentTestimonial ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="text-center">
                    <p className="text-gray-300 mb-4 md:mb-6 italic text-sm md:text-base leading-relaxed">
                      {testimonial.comment}
                    </p>
                    <div className="flex items-center justify-center space-x-3 md:space-x-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div className="text-left">
                        <div className="text-white font-semibold text-sm md:text-base">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-400 text-xs md:text-sm">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center space-x-2 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTestimonial
                      ? "bg-orange-500"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Bitcoin Chart */}
          <BitcoinChart />
        </div>
      </div>
    </div>
  );
}
