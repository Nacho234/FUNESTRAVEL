import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
  },
};

export default nextConfig;
