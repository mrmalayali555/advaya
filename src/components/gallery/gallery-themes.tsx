"use client";

import Image from "next/image";
import { useState } from "react";
import { GalleryLightbox } from "./gallery-lightbox";

/* ─── Types ─── */
type Photo = { id: string; url: string; caption: string; position: number };
type GalleryData = {
  id: string;
  theme: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  blogText?: string | null;
  photos: Photo[];
};

/* ─── Shared polaroid frame ─── */
function Polaroid({
  photo,
  rotate,
  className = "",
  imgClassName = "",
  captionFont = "font-sans",
}: {
  photo?: Photo;
  rotate: string;
  className?: string;
  imgClassName?: string;
  captionFont?: string;
}) {
  if (!photo) return null;
  return (
    <figure data-photo-id={photo.id} className={`group relative bg-white p-2 pb-8 shadow-[2px_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-105 hover:shadow-[4px_8px_32px_rgba(0,0,0,0.15)] hover:z-20 ${className}`}
      style={{ transform: `rotate(${rotate})` }}
    >
      <div className={`relative overflow-hidden bg-ink-100 ${imgClassName}`}>
        <Image
          src={photo.url}
          alt={photo.caption || "Gallery photo"}
          fill
          sizes="200px"
          className="object-cover"
        />
      </div>
      {photo.caption && (
        <figcaption
          className={`mt-2 text-center text-sm text-ink-600 ${captionFont}`}
        >
          {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THEME 1 — BOHEMIAN
   Scattered polaroids around center text on light background.
   Matches the "The New Bohemian" reference image.
   ═══════════════════════════════════════════════════════════════════════════ */

const BOHEMIAN_SLOTS = [
  { top: "2%", left: "2%", rotate: "-6deg", w: "22%", h: "28%" },
  { top: "0%", left: "40%", rotate: "3deg", w: "18%", h: "24%" },
  { top: "3%", right: "2%", rotate: "5deg", w: "20%", h: "30%" },
  { bottom: "3%", left: "3%", rotate: "4deg", w: "24%", h: "32%" },
  { bottom: "5%", left: "35%", rotate: "-3deg", w: "20%", h: "28%" },
  { bottom: "2%", right: "3%", rotate: "-5deg", w: "22%", h: "30%" },
  { top: "30%", left: "0%", rotate: "-8deg", w: "18%", h: "24%" },
];

export function BohemianGallery({ gallery }: { gallery: GalleryData }) {
  const photoMap = new Map(gallery.photos.map((p) => [p.position, p]));

  return (
    <div className="relative mx-auto my-12 w-full max-w-3xl rounded-2xl bg-[#f9f7f4] p-8 shadow-lg sm:p-12">
      {/* Center text */}
      <div className="relative z-10 mx-auto max-w-sm py-16 text-center sm:py-24">
        {gallery.titleLine1 && (
          <p
            className="text-2xl text-ink-500 sm:text-3xl"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            {gallery.titleLine1}
          </p>
        )}
        {gallery.titleLine2 && (
          <h2
            className="mt-1 text-4xl font-bold text-ink-900 sm:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {gallery.titleLine2}
          </h2>
        )}
        {gallery.subtitle && (
          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
            {gallery.subtitle}
          </p>
        )}
      </div>

      {/* Scattered polaroids */}
      {BOHEMIAN_SLOTS.map((slot, i) => {
        const photo = photoMap.get(i);
        if (!photo) return null;
        return (
          <div
            key={photo.id}
            className="absolute hidden sm:block"
            style={{
              top: slot.top,
              left: slot.left,
              right: (slot as any).right,
              bottom: (slot as any).bottom,
              width: slot.w,
              transform: `rotate(${slot.rotate})`,
              zIndex: 1,
            }}
          >
            <figure data-photo-id={photo.id} className="group bg-white p-1.5 pb-6 shadow-[2px_3px_10px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-110 hover:shadow-[4px_8px_24px_rgba(0,0,0,0.25)] hover:z-20">
              <div className="relative aspect-[3/4] overflow-hidden bg-ink-100">
                <Image
                  src={photo.url}
                  alt={photo.caption || ""}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
              {photo.caption && (
                <figcaption
                  className="mt-1.5 text-center text-xs text-ink-500"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {photo.caption}
                </figcaption>
              )}
            </figure>
          </div>
        );
      })}

      {/* Mobile: simple grid fallback */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {gallery.photos.map((photo) => (
          <figure
            key={photo.id}
            data-photo-id={photo.id}
            className="bg-white p-1.5 pb-5 shadow-[1px_2px_8px_rgba(0,0,0,0.1)]"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-ink-100">
              <Image
                src={photo.url}
                alt={photo.caption || ""}
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
            {photo.caption && (
              <figcaption
                className="mt-1 text-center text-xs text-ink-500"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                {photo.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THEME 2 — SCRAPBOOK
   Polaroids with washi tape on textured background.
   Matches the "Brand Blitz" mockup reference.
   ═══════════════════════════════════════════════════════════════════════════ */

const TAPE_COLORS = [
  "bg-amber-200/80",
  "bg-pink-200/80",
  "bg-blue-200/80",
  "bg-green-200/80",
  "bg-purple-200/80",
  "bg-yellow-200/80",
];

const SCRAPBOOK_ROTATIONS = [
  "-3deg", "2deg", "-5deg", "4deg", "-2deg", "6deg",
  "-4deg", "3deg", "-1deg", "5deg",
];

export function ScrapbookGallery({ gallery }: { gallery: GalleryData }) {
  return (
    <div className="mx-auto my-12 w-full max-w-4xl">
      {/* Title */}
      {(gallery.titleLine1 || gallery.titleLine2) && (
        <div className="mb-8 text-center">
          {gallery.titleLine1 && (
            <p
              className="text-xl text-ink-400"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              {gallery.titleLine1}
            </p>
          )}
          {gallery.titleLine2 && (
            <h2
              className="mt-1 text-3xl font-bold text-ink-800 sm:text-4xl"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              {gallery.titleLine2}
            </h2>
          )}
          {gallery.subtitle && (
            <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
              {gallery.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Polaroid grid with tape */}
      <div
        className="rounded-2xl p-6 sm:p-10"
        style={{
          background: "#e8e4de",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23d4d0c8' stroke-width='0.5'/%3E%3C/svg%3E\")",
        }}
      >
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {gallery.photos.map((photo, i) => (
            <div
              key={photo.id}
              className="group relative transition-all duration-300 hover:scale-105 hover:z-10"
              style={{
                transform: `rotate(${SCRAPBOOK_ROTATIONS[i % SCRAPBOOK_ROTATIONS.length]})`,
              }}
            >
              {/* Washi tape strip */}
              <div
                className={`absolute -top-2.5 left-1/2 z-10 h-5 w-14 -translate-x-1/2 rotate-[-2deg] ${TAPE_COLORS[i % TAPE_COLORS.length]}`}
                style={{ clipPath: "polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)" }}
              />

              <figure data-photo-id={photo.id} className="bg-white p-2 pb-7 shadow-[2px_3px_12px_rgba(0,0,0,0.15)]">
                <div className="relative aspect-square overflow-hidden bg-ink-100">
                  <Image
                    src={photo.url}
                    alt={photo.caption || ""}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                {photo.caption && (
                  <figcaption
                    className="mt-2 text-center text-sm text-ink-600"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THEME 3 — CORK BOARD
   Exact replica of the user's HTML/CSS with Cedarville Cursive font.
   Scattered polaroids on wood background with hover zoom.
   ═══════════════════════════════════════════════════════════════════════════ */

const CORK_ROTATIONS = [
  "-10deg", "15deg", "-25deg", "5deg", "5deg",
  "-8deg", "2deg", "-13deg", "-7deg", "2deg", "-3deg",
];

export function CorkBoardGallery({ gallery }: { gallery: GalleryData }) {
  return (
    <div className="mx-auto my-12 w-full max-w-4xl">
      {/* Title */}
      {(gallery.titleLine1 || gallery.titleLine2) && (
        <div className="mb-6 text-center">
          {gallery.titleLine1 && (
            <p
              className="text-xl text-ink-400"
              style={{ fontFamily: "'Cedarville Cursive', cursive" }}
            >
              {gallery.titleLine1}
            </p>
          )}
          {gallery.titleLine2 && (
            <h2
              className="mt-1 text-3xl font-bold text-ink-800 sm:text-4xl"
              style={{ fontFamily: "'Cedarville Cursive', cursive" }}
            >
              {gallery.titleLine2}
            </h2>
          )}
        </div>
      )}

      {/* Wood background board */}
      <div
        className="min-h-[500px] rounded-2xl p-5 sm:p-8"
        style={{
          background: "#8B6914",
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px), repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255,255,255,0.02) 5px, rgba(255,255,255,0.02) 6px)",
        }}
      >
        <div className="flex flex-wrap justify-center gap-0">
          {gallery.photos.map((photo, i) => (
            <figure
              key={photo.id}
              data-photo-id={photo.id}
              className="relative m-2.5 bg-white p-2.5 text-center shadow-[1px_2px_3px_black] transition-all duration-300 hover:scale-110 hover:shadow-[5px_10px_40px_rgba(0,0,0,0.6)] hover:z-20"
              style={{
                transform: `rotate(${CORK_ROTATIONS[i % CORK_ROTATIONS.length]})`,
                fontFamily: "'Cedarville Cursive', cursive",
                fontSize: "15px",
              }}
            >
              <div className="relative h-[150px] w-auto overflow-hidden">
                <Image
                  src={photo.url}
                  alt={photo.caption || ""}
                  width={200}
                  height={150}
                  className="h-[150px] w-auto object-cover"
                />
              </div>
              {photo.caption && (
                <figcaption className="mt-1 text-ink-700">
                  {photo.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Renderer that picks the right theme ─── */
export function EventGalleryRenderer({ gallery }: { gallery: GalleryData }) {
  const [showFullBlog, setShowFullBlog] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; caption: string | null } | null>(null);

  // Strip HTML for preview
  const plainText = gallery.blogText
    ? gallery.blogText.replace(/<[^>]*>/g, "").trim()
    : "";
  const previewText = plainText.slice(0, 200);
  const needsExpand = plainText.length > 200;

  return (
    <div className="mt-12">
      <h2 className="mb-2 text-center text-2xl font-bold text-ink-900">
        Event Memories
      </h2>

      {/* Wrap each theme to inject click handlers */}
      <GalleryClickWrapper onPhotoClick={setLightboxPhoto} gallery={gallery}>
        {gallery.theme === "bohemian" && <BohemianGallery gallery={gallery} />}
        {gallery.theme === "scrapbook" && <ScrapbookGallery gallery={gallery} />}
        {gallery.theme === "corkboard" && <CorkBoardGallery gallery={gallery} />}
      </GalleryClickWrapper>

      {/* Lightbox */}
      {lightboxPhoto !== null && (
        <GalleryLightbox
          photos={[lightboxPhoto]}
          initialIndex={0}
          onClose={() => setLightboxPhoto(null)}
        />
      )}

      {/* Blog Recap — preview + read more */}
      {gallery.blogText && plainText && (
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          {!showFullBlog ? (
            <>
              <p className="text-base leading-relaxed text-ink-600">
                {previewText}
                {needsExpand && "..."}
              </p>
              {needsExpand && (
                <button
                  onClick={() => setShowFullBlog(true)}
                  className="mt-3 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  Read more →
                </button>
              )}
            </>
          ) : (
            <>
              <div
                className="prose prose-sm max-w-none text-ink-600 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2 [&_p]:mb-2"
                dangerouslySetInnerHTML={{ __html: gallery.blogText }}
              />
              <button
                onClick={() => setShowFullBlog(false)}
                className="mt-3 text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                Show less ←
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Click wrapper: intercepts clicks on gallery images ─── */
function GalleryClickWrapper({
  children,
  onPhotoClick,
  gallery,
}: {
  children: React.ReactNode;
  onPhotoClick: (photo: { url: string; caption: string | null }) => void;
  gallery: GalleryData;
}) {
  function handleClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    const figure = target.closest("figure");
    if (!figure) return;

    const id = figure.getAttribute("data-photo-id");
    const img = figure.querySelector("img");
    
    // Find matching photo
    const photo = gallery.photos.find((p) => p.id === id);
    
    if (photo) {
      e.preventDefault();
      onPhotoClick({ url: photo.url, caption: photo.caption || null });
    } else if (img) {
      e.preventDefault();
      let src = img.src;
      try {
        const urlObj = new URL(src, window.location.origin);
        if (urlObj.pathname.startsWith("/_next/image")) {
          const orig = urlObj.searchParams.get("url");
          if (orig) src = orig;
        }
      } catch (err) {}
      onPhotoClick({ url: src, caption: null });
    }
  }

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
}

