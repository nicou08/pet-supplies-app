import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com",
        port: "",
        search: "",
      },
    ],
  },
};

export default nextConfig;
