import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   reactStrictMode: false,
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "**", // Allows images from any domain
         },
      ],
   },
};

export default nextConfig;
