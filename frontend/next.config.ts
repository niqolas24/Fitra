import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from any domain (for potential avatar/logo usage)
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
