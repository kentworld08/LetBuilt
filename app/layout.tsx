import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CallToAction } from "@/components/CallToAction";
import { NotificationSystem } from "@/components/NotificationSystem";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LetBuilt - Cryptocurrency Trading Platform",
  description: "Your trusted Bitcoin mining and investment company",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          id="chatway"
          async
          src="https://cdn.chatway.app/widget.js?id=qMqXR0DPaAMW"
        ></script>
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <Header />
          {children}
          <CallToAction />
          <NotificationSystem />
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
