import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: "50mb",
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "Content-Security-Policy",
          value: "upgrade-insecure-requests",
        },
      ],
    },
  ],
  rewrites: async () => [
    {
      source: "/google:code.html",
      destination: "/api/google-verify/:code",
    },
  ],
};

export default nextConfig;
