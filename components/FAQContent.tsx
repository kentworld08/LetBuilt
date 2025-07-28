"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const faqData = [
  {
    id: 1,
    question: "What is Letbuilt?",
    answer:
      "LetBuilt is a registered digital asset investment firm based in the UK. The platform, which includes advanced basic and technical analysis at the source of high return performance, offers high & fixed interest return. Aiming for success with its international investor network, experienced team, privileged information from business and technology world; Bynamic stands out from its competitors with its proven quality and ease of use. The company, which is managed under the leadership of people who think and foresee the future, is committed to achieving high returns from well-diversified portfolios and prioritizing clients.",
  },
  {
    id: 2,
    question: "What are digital assets and how are they valued?",
    answer:
      "Digital assets distributed ledger based electronic means of exchanges. Transactions involving them are secured by cryptography, and they have dedicated servers for verification of transactions and the creation of extra units. The most popular of them are Bitcoin, Ethereum, Litecoin, etc. All digital assets are valued by price action, and as a result, almost total control is in the hand of the investing public.",
  },
  {
    id: 3,
    question: "What are company principles?",
    answer:
      "LetBuilt operates on core principles of transparency, security, innovation, and customer success. We are committed to providing reliable and secure trading services, maintaining the highest standards of data protection, offering educational resources to empower our users, and ensuring fair and transparent trading conditions. Our mission is to democratize access to financial markets while prioritizing user safety and regulatory compliance.",
  },
  {
    id: 4,
    question: "Guaranteed interest returns, but how?",
    answer:
      "Digital assets are a class of assets considered dangerous and inconvenient. Many reasons such as liquidity, money laundering accusation, uncertainty of regulation, access restriction, volatile markets, functionality inquiries reduce trust in these assets. We believe that the risk factor should be eliminated for all people who believe that finance will rise on distributed systems. That's why we offer high interest returns to platform investors. With careful and detailed examination of market conditions, daily trading volume, expectations; we change our portfolio distribution and adjust our investment strategy. With this active fund management, you enjoy the fixed interest rate return on the user side.",
  },
  {
    id: 5,
    question: "How can i ask for support?",
    answer:
      "You can reach our support team through multiple channels: 1) Email us at support@letbuilt.com for detailed inquiries, 2) Use our live chat feature available on the website during business hours (MON-SAT 08AM - 05PM), 3) Contact us through our Contact Us page with your specific questions, 4) Access our comprehensive help documentation and tutorials available in your user dashboard. Our dedicated support team is committed to helping you with any questions or issues you may encounter.",
  },
];

export function FAQContent() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
  };

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8">
            <span className="text-orange-500">Frequently</span> Asked Questions
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm md:text-base">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span>FAQS</span>
          </div>
        </div>

        {/* Animated blockchain particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particles-container">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${(i * 7) % 100}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${12 + (i % 8)}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-orange-500">
                General Questions
              </h2>
              <p className="text-gray-300 text-sm md:text-base lg:text-lg">
                Find answers to the most commonly asked questions about LetBuilt
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4 md:space-y-6">
              {faqData.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500/50 transition-all duration-300"
                >
                  {/* Question */}
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

                  {/* Answer */}
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

            {/* Contact Support Section */}
            <div className="mt-12 md:mt-16 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg p-6 md:p-8 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-300 mb-6 text-sm md:text-base">
                Can`t find the answer you`re looking for? Our support team is
                here to help you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center space-x-2 text-orange-500">
                  <span className="text-lg">📧</span>
                  <a
                    href="mailto:support@letbuilt.com"
                    className="hover:text-orange-400 transition-colors font-medium"
                  >
                    support@letbuilt.com
                  </a>
                </div>
                <div className="hidden sm:block text-gray-500">|</div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <span className="text-lg">🕒</span>
                  <span className="text-sm">MON-SAT 08AM - 05PM</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors">
                <div className="text-2xl mb-3">📚</div>
                <h4 className="text-white font-semibold mb-2">
                  Getting Started
                </h4>
                <p className="text-gray-400 text-sm">
                  Learn the basics of trading with LetBuilt
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors">
                <div className="text-2xl mb-3">🔒</div>
                <h4 className="text-white font-semibold mb-2">Security</h4>
                <p className="text-gray-400 text-sm">
                  Understand our security measures
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors">
                <div className="text-2xl mb-3">💰</div>
                <h4 className="text-white font-semibold mb-2">Trading Guide</h4>
                <p className="text-gray-400 text-sm">
                  Advanced trading strategies and tips
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
