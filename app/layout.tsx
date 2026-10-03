import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import ConditionalLayout from "@/components/ConditionalLayout";

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
          <ConditionalLayout>{children}</ConditionalLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
