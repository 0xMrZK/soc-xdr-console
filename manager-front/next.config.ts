import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "ec2-34-254-15-162.eu-west-1.compute.amazonaws.com",
    "centralmanager.wiga.fr",
  ],
};

export default nextConfig;
