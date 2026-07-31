import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't pick a stray parent lockfile.
  turbopack: {
    root: __dirname,
  },

  // ── Performance ──────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  // Tree-shake large icon/animation packages so only used exports are bundled.
  experimental: {
    cpus: 2, // Limit build workers to prevent Prisma connection pool exhaustion during SSG
    optimizePackageImports: ["lucide-react", "framer-motion"],
    // Aggressive client-side route caching (30 min stale, 5 min revalidate)
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },

  images: {
    // Local uploads are served from /uploads (see public/uploads).
    // Add your Supabase/Cloudinary host here when you connect cloud storage.
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year for transformed images
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
