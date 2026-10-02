import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * allowedDevOrigins — suppresses the cross-origin HMR warning when
   * accessing the dev server from your local network IP (e.g., hotspot / LAN).
   * Add any IP/hostname you browse from during development.
   */
  allowedDevOrigins: [
    "172.20.10.6",      // local network / hotspot IP
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
  ],

  /**
   * Proxy /api/* → NestJS backend.
   * In the browser, all fetches go to the same origin (:3000/api/...) so
   * there is zero CORS negotiation. Next.js forwards server-side.
   *
   * In production set NEXT_PUBLIC_API_URL to your deployed backend URL.
   */
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3001";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },

  /** Security headers applied to every route */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options",        value: "DENY"    },
          {
            key:   "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
