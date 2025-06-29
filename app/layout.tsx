import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import head from "next/head";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ghanathe Rohit",
  description: "A showcase of my work as a full-stack developer",
  keywords: [
    "Ghanathe Rohit",
    "Portfolio",
    "Full-Stack Developer",
    "Web Developer",
    "MERN Stack",
    "Software Engineer",
    "Tech Enthusiast",
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Ghanathe Rohit",
    description: "A showcase of my work as a full-stack developer",
    images: [
      {
        url: '/preview.png',
        width: 1920,
        height: 1080,
        alt: 'Ghanathe Rohit Portfolio',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
