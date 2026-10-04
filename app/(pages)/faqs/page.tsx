import { FAQContent } from "@/components/FAQContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LetBuilt - Cryptocurrency Trading Platform",
  description: "Your trusted Bitcoin mining and investment company",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <FAQContent />
    </div>
  );
}
