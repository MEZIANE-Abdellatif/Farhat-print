import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["fabric"],
  images: {
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
