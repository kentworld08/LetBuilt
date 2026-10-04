import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const pathname = request.nextUrl.pathname;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/affiliate") ||
    pathname.startsWith("/cfd") ||
    pathname.startsWith("/faqs") ||
    pathname.startsWith("/forex-trading") ||
    pathname.startsWith("/terms");

  const isContactRoute =
    pathname === "/contact" || pathname.startsWith("/contact/");

  // Logged-out users cannot access the authenticated app.
  if (
    !user &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/deposit") ||
      pathname.startsWith("/withdraw") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/profile/setup"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";

    return NextResponse.redirect(url);
  }

  // Logged-in users cannot return to the authentication page.
  if (user && pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";

    return NextResponse.redirect(url);
  }

  // Logged-in users cannot return to the public website.
  //
  // Contact is intentionally excluded here so authenticated
  // users can use Contact Support from the dashboard.
  if (user && isPublicRoute && !isContactRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";

    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/about/:path*",
    "/contact/:path*",
    "/auth/:path*",
    "/dashboard/:path*",
    "/deposit/:path*",
    "/withdraw/:path*",
    "/profile/setup/:path*",
    "/affiliate/:path*",
    "/cfd/:path*",
    "/faqs/:path*",
    "/admin/:path*",
    "/forex-trading/:path*",
    "/terms/:path*",
  ],
};
