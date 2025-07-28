import Link from "next/link";

export function AboutPageContent() {
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8">
            About <span className="text-orange-500">LetBuilt</span>
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm md:text-base">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span>ABOUT US</span>
          </div>
        </div>

        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particles-container">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${8 + Math.random() * 12}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
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

                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                    Our Mission
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-md text-justify">
                    Our Mission Is To Bring Trading To The Masses. We do so by
                    providing an intuitive trading platform designed with the
                    latest technological advancements that`s geared towards new
                    traders as well as professionals. We place great emphasis on
                    education, providing a well-rounded library of V.O.D.
                    seminars, webinars, daily news, analysis and more. Our
                    customer service and support is always available to meet
                    your needs, and our account managers know that your success
                    is our success.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                    Our Vision
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-md text-justify">
                    LetBuilt was established as a way for traders to invest in
                    the financial markets on a platform that is user friendly.
                    Your success is a testament of our commitment to any
                    investor who chooses to trade with Valuace. That is why we
                    strive to provide you with an expanding asset selection,
                    dedicated support and personal assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
