import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/privacy",
        destination: "/confidentialite",
      },
      {
        source: "/terms",
        destination: "/conditions",
      },
    ];
  },
};

export default nextConfig;
