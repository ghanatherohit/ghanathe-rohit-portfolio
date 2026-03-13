import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://ghanathe-rohit-portfolio.vercel.app";

const isProduction =
  process.env.VERCEL_ENV === "production" ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
