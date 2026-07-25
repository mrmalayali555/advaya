import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't pick a stray parent lockfile.
  turbopack: {
    root: __dirname,
  },
  images: {
    // Local uploads are served from /uploads (see public/uploads).
    // Add your Supabase/Cloudinary host here when you connect cloud storage.
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
