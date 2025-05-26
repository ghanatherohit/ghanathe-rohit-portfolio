import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      unoptimized: true,
    },
  devIndicators: false
};

export default nextConfig;
