import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 390, 430, 640, 750, 828, 1080, 1200, 1600],
    imageSizes: [64, 96, 128, 256, 384],
  },
};

export default nextConfig;
