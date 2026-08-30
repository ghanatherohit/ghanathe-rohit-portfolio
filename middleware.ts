import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/config";

const targetHost = SITE_URL ? new URL(SITE_URL).host : "";
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
