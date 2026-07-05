import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 旧域名 → 正式域名（Google OAuth 回调只注册了 wc26cards.fyi）
      {
        source: "/:path*",
        has: [{ type: "host", value: "worldcupnamecard.vercel.app" }],
        destination: "https://wc26cards.fyi/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
