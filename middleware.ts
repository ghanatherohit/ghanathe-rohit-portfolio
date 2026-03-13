import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const targetHost = configuredSiteUrl ? new URL(configuredSiteUrl).host : "";
const isProduction = process.env.VERCEL_ENV === "production";

export function middleware(request: NextRequest) {
  if (!isProduction || !targetHost) {
    return NextResponse.next();
  }

  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host") || "";

  if (host === targetHost) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.host = targetHost;

  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
