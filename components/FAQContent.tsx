import HeroBanner from "@/lib/HeroBanner";
import FaqAccordion from "./faqAccordion";

export function FAQContent() {
  return (
    <div className="bg-gray-900 text-white">
      <HeroBanner title1="Frequently" title2="Asked Questions" sub="FAQS" />

      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-orange-500">
                General Questions
              </h2>
              <p className="text-gray-300 text-sm md:text-base lg:text-lg">
                Find answers to the most commonly asked questions about LetBuilt
              </p>
            </div>

            <FaqAccordion />

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
