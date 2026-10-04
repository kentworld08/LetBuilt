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

  const isAuthenticatedApp =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/deposit") ||
    pathname.startsWith("/profile/setup") ||
    pathname.startsWith("/withdraw") ||
    pathname.startsWith("/auth");

  const isPublicWebsite =
    pathname === "/" ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/affiliate") ||
    pathname.startsWith("/cfd") ||
    pathname.startsWith("/faqs") ||
    pathname.startsWith("/forex-trading") ||
    pathname.startsWith("/terms");

  // Authenticated app pages and 404 pages
  // should not display the global website header/footer.
  if (isAuthenticatedApp || !isPublicWebsite) {
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
