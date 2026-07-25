import Image from "next/image";

type MediaItem = { id: string; type: string; url: string; caption?: string | null };

export function MediaGallery({ media }: { media: MediaItem[] }) {
  if (!media.length) return null;
  const images = media.filter((m) => m.type === "image");
  const videos = media.filter((m) => m.type === "video");

  return (
    <div className="space-y-8">
      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((m) => (
            <figure
              key={m.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink-100 bg-surface"
            >
              <Image
                src={m.url}
                alt={m.caption || "Gallery image"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
              />
              {m.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent p-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {m.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
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
