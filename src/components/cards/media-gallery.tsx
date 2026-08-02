"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";

type MediaItem = { id: string; type: string; url: string; caption?: string | null };

export function MediaGallery({ media }: { media: MediaItem[] }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  if (!media.length) return null;
  const images = media.filter((m) => m.type === "image");
  const videos = media.filter((m) => m.type === "video");

  const lightboxPhotos = images.map((img) => ({
    url: img.url,
    caption: img.caption,
  }));

  return (
    <div className="space-y-8">
      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((m, idx) => (
            <figure
              key={m.id}
              onClick={() => setSelectedPhotoIndex(idx)}
              className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-surface transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
            >
              <Image
                src={m.url}
                alt={m.caption || "Gallery image"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end justify-between p-3 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {m.caption ? (
                  <figcaption className="text-xs text-white/90 truncate max-w-[80%]">
                    {m.caption}
                  </figcaption>
                ) : (
                  <span />
                )}
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-md">
                  <Maximize2 className="h-3.5 w-3.5" />
                </span>
              </div>
            </figure>
          ))}
        </div>
      )}

      {/* Lightbox for viewing photos full size with prev/next */}
      {selectedPhotoIndex !== null && (
        <GalleryLightbox
          photos={lightboxPhotos}
          initialIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}

      {videos.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {videos.map((m) => (
            <div
              key={m.id}
              className="overflow-hidden rounded-2xl border border-ink-100 bg-black"
            >
              <video
                src={m.url}
                controls
                className="aspect-video w-full"
                preload="metadata"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
