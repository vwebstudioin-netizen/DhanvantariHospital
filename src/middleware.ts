import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPaymentMode } from "@/lib/payment-mode";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const paymentMode = getPaymentMode();
  if (paymentMode === "on" && pathname !== "/maintenance") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/maintenance";
    return NextResponse.redirect(redirectUrl);
  }

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    // In a real app, verify the Firebase ID token cookie/header here.
    // For the template, we allow access but the admin pages will check auth client-side.
    return NextResponse.next();
  }

  // Patient portal routes protection
  if (pathname.startsWith("/portal")) {
    // Same as admin — client-side auth check handles the redirect.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
