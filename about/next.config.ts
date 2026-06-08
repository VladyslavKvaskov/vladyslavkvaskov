import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2592000,
    qualities: [100, 75],
  },
};

export default nextConfig;
