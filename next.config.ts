import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.meesho.com',
      },
    ],
  },
  outputFileTracingIncludes: {
    "/*": ["./prisma/**/*", "./prisma/prisma/**/*"],
    "/api/**/*": ["./prisma/**/*", "./prisma/prisma/**/*"]
  },
  turbopack: {
    root: path.resolve(__dirname, '..'),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
