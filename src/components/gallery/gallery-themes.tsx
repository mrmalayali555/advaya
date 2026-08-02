"use client";

import Image from "next/image";
import { useState } from "react";
import { GalleryLightbox } from "./gallery-lightbox";
import { GalleryPhotoImg } from "@/components/ui/gallery-photo-img";

/* ─── Types ─── */
type Photo = { id: string; url: string; caption: string; position: number; zoom?: number; offsetX?: number; offsetY?: number; rotation?: number; };
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
      <GalleryPhotoImg
        src={photo.url}
        alt={photo.caption || "Gallery photo"}
        aspectRatio="3/4"
        zoom={photo.zoom || 1}
        offsetX={photo.offsetX || 0}
        offsetY={photo.offsetY || 0}
        rotation={photo.rotation || 0}
        className={imgClassName}
      />
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

// Unused in new responsive flex layout, but keeping variable for reference
const BOHEMIAN_ROTATIONS = [
  "-6deg", "4deg", "8deg", "-4deg", "-12deg", "10deg", "-3deg", "-5deg", "-8deg"
];

export function BohemianGallery({ gallery }: { gallery: GalleryData }) {
  return (
    <div className="relative mx-auto my-12 w-full max-w-5xl rounded-2xl glass-card p-8 sm:p-12">
      {/* Center text */}
      <div className="mx-auto max-w-2xl text-center mb-16">
        {gallery.titleLine1 && (
          <p
            className="text-2xl text-on-surface-variant sm:text-3xl"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            {gallery.titleLine1}
          </p>
        )}
        {gallery.titleLine2 && (
          <h2
            className="mt-2 text-4xl font-bold text-on-surface sm:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {gallery.titleLine2}
          </h2>
        )}
        {gallery.subtitle && (
          <p className="mx-auto mt-6 text-base leading-relaxed text-on-surface-variant">
            {gallery.subtitle}
          </p>
        )}
      </div>

      {/* Scattered polaroids (flex wrap layout) */}
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
        {gallery.photos.map((photo, i) => {
          const rotation = BOHEMIAN_ROTATIONS[i % BOHEMIAN_ROTATIONS.length];
          return (
            <div
              key={photo.id}
              className="w-40 sm:w-56"
              style={{
                transform: `rotate(${rotation})`,
              }}
            >
              <figure data-photo-id={photo.id} className="group glass-card bg-surface/50 p-2 pb-8 sm:p-3 sm:pb-12 shadow-[2px_3px_10px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-110 hover:shadow-[4px_8px_24px_rgba(120,0,255,0.25)] hover:z-20">
                <GalleryPhotoImg
                  src={photo.url}
                  alt={photo.caption || ""}
                  aspectRatio="3/4"
                  zoom={photo.zoom || 1}
                  offsetX={photo.offsetX || 0}
                  offsetY={photo.offsetY || 0}
                  rotation={photo.rotation || 0}
                  className="rounded-sm"
                />
                {photo.caption && (
                  <figcaption
                    className="mt-3 text-center text-sm text-on-surface-variant"
                    style={{ fontFamily: "'Caveat', cursive" }}
                  >
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            </div>
          );
        })}
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
              className="text-xl text-on-surface-variant"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              {gallery.titleLine1}
            </p>
          )}
          {gallery.titleLine2 && (
            <h2
              className="mt-1 text-3xl font-bold text-on-surface sm:text-4xl"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              {gallery.titleLine2}
            </h2>
          )}
          {gallery.subtitle && (
            <p className="mx-auto mt-3 max-w-md text-sm text-on-surface-variant">
              {gallery.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Polaroid grid with tape */}
      <div
        className="rounded-2xl p-6 sm:p-10 glass-card bg-surface/20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3C/svg%3E\")",
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

              <figure data-photo-id={photo.id} className="glass-card bg-surface/50 p-2 pb-7 shadow-[2px_3px_12px_rgba(0,0,0,0.4)]">
                <GalleryPhotoImg
                  src={photo.url}
                  alt={photo.caption || ""}
                  aspectRatio="1/1"
                  zoom={photo.zoom || 1}
                  offsetX={photo.offsetX || 0}
                  offsetY={photo.offsetY || 0}
                  rotation={photo.rotation || 0}
                  className="rounded-sm"
                />
                {photo.caption && (
                  <figcaption
                    className="mt-2 text-center text-sm text-on-surface-variant"
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
              className="text-xl text-on-surface-variant"
              style={{ fontFamily: "'Cedarville Cursive', cursive" }}
            >
              {gallery.titleLine1}
            </p>
          )}
          {gallery.titleLine2 && (
            <h2
              className="mt-1 text-3xl font-bold text-on-surface sm:text-4xl"
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
          background: "#3b2a09", // Darker wood for dark mode
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 21px), repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255,255,255,0.02) 5px, rgba(255,255,255,0.02) 6px)",
        }}
      >
        <div className="flex flex-wrap justify-center gap-0">
          {gallery.photos.map((photo, i) => (
            <figure
              key={photo.id}
              data-photo-id={photo.id}
              className="relative m-2.5 glass-card bg-[#f4f0e6] p-2.5 text-center shadow-[1px_2px_12px_rgba(0,0,0,0.8)] transition-all duration-300 hover:scale-110 hover:shadow-[5px_10px_40px_rgba(0,0,0,0.9)] hover:z-20 text-ink-900"
              style={{
                transform: `rotate(${CORK_ROTATIONS[i % CORK_ROTATIONS.length]})`,
                fontFamily: "'Cedarville Cursive', cursive",
                fontSize: "15px",
              }}
            >
              <GalleryPhotoImg
                src={photo.url}
                alt={photo.caption || ""}
                aspectRatio="4/3"
                zoom={photo.zoom || 1}
                offsetX={photo.offsetX || 0}
                offsetY={photo.offsetY || 0}
                rotation={photo.rotation || 0}
                className="h-[150px] w-[200px]"
              />
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

/* ═══════════════════════════════════════════════════════════════════════════
   THEME 4 — NORMAL
   Responsive masonry-like grid using CSS columns. Natural aspect ratios.
   ═══════════════════════════════════════════════════════════════════════════ */

export function NormalGallery({ gallery }: { gallery: GalleryData }) {
  return (
    <div className="mx-auto my-12 w-full max-w-6xl px-4 sm:px-6">
      {/* Title */}
      {(gallery.titleLine1 || gallery.titleLine2 || gallery.subtitle) && (
        <div className="mb-8 text-center">
          {gallery.titleLine1 && (
            <p className="text-xl text-on-surface-variant font-medium">
              {gallery.titleLine1}
            </p>
          )}
          {gallery.titleLine2 && (
            <h2 className="mt-1 text-3xl font-bold text-on-surface sm:text-4xl">
              {gallery.titleLine2}
            </h2>
          )}
          {gallery.subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-sm text-on-surface-variant">
              {gallery.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Masonry Grid */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {gallery.photos.map((photo) => (
          <figure
            key={photo.id}
            data-photo-id={photo.id}
            className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-outline-variant/30 bg-surface/50 p-2 shadow-sm transition-all duration-300 hover:shadow-md hover:border-outline-variant glass-card group"
          >
            <GalleryPhotoImg
              src={photo.url}
              alt={photo.caption || "Gallery photo"}
              zoom={photo.zoom || 1}
              offsetX={photo.offsetX || 0}
              offsetY={photo.offsetY || 0}
              rotation={photo.rotation || 0}
              className="rounded-lg"
            />
            {photo.caption && (
              <figcaption className="mt-2 px-1 text-sm text-on-surface-variant text-center">
                {photo.caption}
              </figcaption>
            )}
          </figure>
        ))}
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
    ? gallery.blogText
        .replace(/&nbsp;/g, " ")
        .replace(/<\/?(p|div|br|h[1-6])[^>]*>/gi, " ")
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim()
    : "";
  const previewText = plainText.slice(0, 200);
  const needsExpand = plainText.length > 200;

  return (
    <div className="mt-12">
      <h2 className="mb-2 text-center text-2xl font-bold text-on-surface">
        Event Memories
      </h2>

      {/* Wrap each theme to inject click handlers */}
      <GalleryClickWrapper onPhotoClick={setLightboxPhoto} gallery={gallery}>
        {gallery.theme === "bohemian" && <BohemianGallery gallery={gallery} />}
        {gallery.theme === "scrapbook" && <ScrapbookGallery gallery={gallery} />}
        {gallery.theme === "corkboard" && <CorkBoardGallery gallery={gallery} />}
        {gallery.theme === "normal" && <NormalGallery gallery={gallery} />}
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
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl glass-card p-6">
          {!showFullBlog ? (
            <>
              <p className="text-base leading-relaxed text-on-surface-variant">
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
                className="prose prose-sm max-w-none text-on-surface-variant [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2 [&_p]:mb-2"
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

