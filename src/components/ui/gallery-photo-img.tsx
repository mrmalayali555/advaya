"use client";

import React, { useState } from "react";

interface GalleryPhotoImgProps {
  src: string;
  alt?: string;
  rotation?: number;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  aspectRatio?: string; // Optional fixed aspect ratio (e.g., "3/4" or "1/1")
  className?: string;
  children?: React.ReactNode;
}

export function GalleryPhotoImg({
  src,
  alt = "",
  rotation = 0,
  zoom = 1,
  offsetX = 0,
  offsetY = 0,
  aspectRatio: fixedAspectRatio,
  className = "",
  children,
}: GalleryPhotoImgProps) {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const is90or270 = Math.abs(Math.round(rotation || 0)) % 180 === 90;

  // Compute the container aspect ratio (swapping width and height if rotated 90/270 deg)
  let computedAspectRatio: string | undefined = undefined;
  if (fixedAspectRatio) {
    if (is90or270 && fixedAspectRatio.includes("/")) {
      const [w, h] = fixedAspectRatio.split("/");
      computedAspectRatio = `${h}/${w}`;
    } else {
      computedAspectRatio = fixedAspectRatio;
    }
  } else if (naturalSize && naturalSize.w && naturalSize.h) {
    computedAspectRatio = is90or270
      ? `${naturalSize.h}/${naturalSize.w}`
      : `${naturalSize.w}/${naturalSize.h}`;
  }

  return (
    <div
      className={`relative w-full overflow-hidden bg-ink-100 flex items-center justify-center [container-type:size] ${className}`}
      style={{
        aspectRatio: computedAspectRatio,
        minHeight: !computedAspectRatio ? "220px" : undefined,
      }}
    >
      <img
        ref={(el) => {
          if (el && el.naturalWidth && el.naturalHeight && !naturalSize) {
            setNaturalSize({ w: el.naturalWidth, h: el.naturalHeight });
          }
        }}
        src={src}
        alt={alt}
        onLoad={(e) => {
          setNaturalSize({
            w: e.currentTarget.naturalWidth,
            h: e.currentTarget.naturalHeight,
          });
        }}
        className="absolute object-cover transition-all duration-200"
        style={{
          width: is90or270 ? "100cqh" : "100%",
          height: is90or270 ? "100cqw" : "100%",
          transform: `scale(${zoom}) translate(${offsetX}%, ${offsetY}%) rotate(${rotation}deg)`,
        }}
        loading="lazy"
      />
      {children}
    </div>
  );
}
