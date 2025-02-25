import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: true, // Ensure App Router is enabled
  },
};

export default nextConfig;
