import Image from "next/image";

const features = [
  {
    icon: "/strong-security.png",
    title: "STRONG SECURITY",
    description: "Protection against DDoS attacks,\nfull data encryption",
  },
  {
    icon: "/world-coverage.png",
    title: "WORLD COVERAGE",
    description: "Providing services in 99% countries\naround all the globe",
  },
  {
    icon: "/payment-options.png",
    title: "PAYMENT OPTIONS",
    description: "Popular methods: Bitcoin, Ethereum,\nSkril",
  },
  {
    icon: "/mobile-app.png",
    title: "MOBILE FRIENDLY",
    description: "Our User Dashboard is Made\nto match all Mobile resolution",
  },
  {
    icon: "/cost-efficiency.png",
    title: "COST EFFICIENCY",
    description: "Reasonable trading fees for traders\nand all market makers",
  },
  {
    icon: "/high-liquidity.png",
    title: "HIGH LIQUIDITY",
    description:
      "Fast access to high liquidity orderbook\nfor top currency pairs",
  },
];

export function Features() {
  return (
    <div className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-3 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-4">
                  <div className="mb-3 md:mb-4">
                    <Image
                      src={feature.icon || "/placeholder.svg"}
                      alt={feature.title}
                      width={30}
                      height={30}
                      className="mx-auto md:w-8 md:h-9"
                    />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-xs md:text-sm whitespace-pre-line">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center mt-8 lg:mt-0 bg-[url('/homebg1.jpg')] bg-cover bg-center w-[330px] opacity-70">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors">
                <div className="w-0 h-0 border-l-[8px] md:border-l-[10px] lg:border-l-[12px] border-l-transparent border-r-[8px] md:border-r-[10px] lg:border-r-[12px] border-r-transparent border-b-[14px] md:border-b-[17px] lg:border-b-[20px] border-b-white ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
