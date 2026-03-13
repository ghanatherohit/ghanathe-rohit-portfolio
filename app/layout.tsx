import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://ghanathe-rohit-portfolio.vercel.app";

const GOOGLE_SITE_VERIFICATION =
  process.env.GOOGLE_SITE_VERIFICATION ||
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Ghanathe Rohit Portfolio",
  referrer: "origin-when-cross-origin",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  title: {
    default: "Ghanathe Rohit | Full-Stack Web Developer Portfolio",
    template: "%s | Ghanathe Rohit",
  },
  description:
    "Ghanathe Rohit — Aspiring Full Stack Web Developer skilled in JavaScript, React.js, Next.js, Node.js, MySQL, and MongoDB. Experienced in building responsive web applications and REST APIs.",
  keywords: [
    "Ghanathe Rohit",
    "Ghanathe Rohit Portfolio",
    "Rohit Ghanathe",
    "ghanathe rohit",
    "ghanathe rohit portfolio",
    "Full-Stack Developer",
    "Web Developer",
    "MERN Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "JavaScript Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "Portfolio Website",
  ],
  authors: [{ name: "Ghanathe Rohit", url: SITE_URL }],
  creator: "Ghanathe Rohit",
  publisher: "Ghanathe Rohit",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Ghanathe Rohit Portfolio",
    title: "Ghanathe Rohit | Full-Stack Web Developer Portfolio",
    description:
      "Ghanathe Rohit — Aspiring Full Stack Web Developer skilled in JavaScript, React.js, Next.js, Node.js, MySQL, and MongoDB. Experienced in building responsive web applications and REST APIs.",
    images: [
      {
        url: `${SITE_URL}/preview.png`,
        width: 1920,
        height: 1080,
        alt: "Ghanathe Rohit — Full-Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghanathe Rohit | Full-Stack Developer Portfolio",
    description:
      "Aspiring Full Stack Web Developer skilled in JavaScript, React.js, Next.js, Node.js, MySQL, and MongoDB.",
    images: [`${SITE_URL}/preview.png`],
    site: "@ghanatherohit",
    creator: "@ghanatherohit",
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {GOOGLE_SITE_VERIFICATION ? (
          <meta
            name="google-site-verification"
            content={GOOGLE_SITE_VERIFICATION}
          />
        ) : null}
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
