import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["visibee.fr", "localhost", "placehold.co", "eu.ui-avatars.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eu.ui-avatars.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
    ],
  }
};

export default nextConfig;