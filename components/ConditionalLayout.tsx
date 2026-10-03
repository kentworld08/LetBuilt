"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { CallToAction } from "./CallToAction";
import { NotificationSystem } from "./NotificationSystem";
import { Footer } from "./Footer";

type ConditionalLayoutProps = {
  children: React.ReactNode;
};

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/deposit") ||
    pathname.startsWith("/profile/setup") ||
    pathname.startsWith("/auth");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />

      {children}

      <CallToAction />
      <NotificationSystem />
      <Footer />
    </>
  );
}
