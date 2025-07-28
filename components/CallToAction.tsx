import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <div className="py-12 md:py-16 text-center text-white bg-[url('/dotted-world-map.png')] bg-cover">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
          GET STARTED TODAY WITH BITCOIN INVESTMENT
        </h2>
        <p className="text-lg md:text-xl mb-6 md:mb-8">
          Open account for free and start trading!
        </p>
        <Button
          size="lg"
          variant="outline"
          className="bg-white text-orange-600 hover:bg-gray-100 text-sm md:text-base"
        >
          GET STARTED
        </Button>
      </div>
    </div>
  );
}
