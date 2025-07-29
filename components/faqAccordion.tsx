"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { faqData } from "@/constants/Data";

const FaqAccordion = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
  };
  return (
    <div className="space-y-4 md:space-y-6">
      {faqData.map((item) => (
        <div
          key={item.id}
          className="bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500/50 transition-all duration-300"
        >
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset rounded-lg"
          >
            <h3 className="text-lg md:text-xl font-semibold text-white pr-4">
              {item.question}
            </h3>
            <div className="flex-shrink-0">
              {openItems.includes(item.id) ? (
                <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
              ) : (
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
              )}
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openItems.includes(item.id)
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-6 md:px-8 pb-6 md:pb-8">
              <div className="border-t border-gray-700 pt-4 md:pt-6">
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;
