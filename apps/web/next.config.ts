import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@juice-stop/shared"],
  // Prisma and server-only packages must not be bundled by webpack
  serverExternalPackages: ["@prisma/client", "prisma", "bcryptjs", "jsonwebtoken"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
