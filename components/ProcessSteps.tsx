import Image from "next/image";

const steps = [
  {
    icon: "/download-bitcoin.png",
    title: "Download Bitcoin Wallet",
    description: "Get it on PC or Mobile to create, send and receive bitcoins.",
  },
  {
    icon: "/add-bitcoins.png",
    title: "Add Funds & Start Investment",
    description: "Add bitcoins you've created or exchanged via credit card.",
  },
  {
    icon: "/buy-sell-bitcoins.png",
    title: "Withdraw Your Profit",
    description: "Request for withdrawal and receive it within 1day.",
  },
];

export function ProcessSteps() {
  return (
    <div className="bg-gray-900 text-white py-16 relative -mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4 text-center md:text-left"
            >
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <Image
                  src={step.icon || "/placeholder.svg"}
                  alt={step.title}
                  width={30}
                  height={30}
                  className="md:w-10 md:h-10"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
