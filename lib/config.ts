/**
 * Shared site configuration — single source of truth for SITE_URL and
 * environment flags. Import from here rather than duplicating across files.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://ghanathe-rohit-portfolio.vercel.app";

export const IS_PRODUCTION =
  process.env.VERCEL_ENV === "production" ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");
