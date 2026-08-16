import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["ar", "fr"];
const DEFAULT_LOCALE = "fr";
const COOKIE_NAME = "NEXT_LOCALE";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle initial root "/" entry point
  if (pathname === "/") {
    // 1. Check manual language choice in cookie
    const savedLocale = request.cookies.get(COOKIE_NAME)?.value;
    if (savedLocale && LOCALES.includes(savedLocale)) {
      return NextResponse.redirect(new URL(`/${savedLocale}`, request.url));
    }

    // 2. Check Accept-Language header
    const acceptLanguage = request.headers.get("accept-language") || "";
    let targetLocale = DEFAULT_LOCALE;

    if (
      acceptLanguage.toLowerCase().startsWith("ar") ||
      acceptLanguage.toLowerCase().includes(",ar")
    ) {
      targetLocale = "ar";
    }

    return NextResponse.redirect(new URL(`/${targetLocale}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
