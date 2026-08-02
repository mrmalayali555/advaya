"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn, Download, ExternalLink, Maximize2 } from "lucide-react";

interface ExpandableImageProps {
  src: string;
  alt: string;
  caption?: string | null;
  aspectRatio?: string; // e.g. "aspect-[16/9]", "aspect-[4/3]", "aspect-auto"
  objectFit?: "contain" | "cover";
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  showExpandPrompt?: boolean;
}

export function ExpandableImage({
  src,
  alt,
  caption,
  aspectRatio = "aspect-[16/9]",
  objectFit = "contain",
  priority = false,
  className = "",
  containerClassName = "",
  showExpandPrompt = true,
}: ExpandableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {/* Thumbnail Container */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group relative w-full cursor-zoom-in overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 text-left transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${aspectRatio} ${containerClassName}`}
        aria-label={`Enlarge image: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
          className={`transition-transform duration-500 ease-out group-hover:scale-[1.02] ${
            objectFit === "cover" ? "object-cover" : "object-contain"
          } ${className}`}
        />

        {/* Hover Overlay Gradient & Hint */}
        {showExpandPrompt && (
          <div className="absolute inset-0 flex items-end justify-end p-3 sm:p-4 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90 sm:opacity-0 transition-opacity duration-300 sm:group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md border border-white/20 shadow-lg">
              <Maximize2 className="h-3.5 w-3.5 text-purple-300" />
              <span className="hidden xs:inline">Click to enlarge</span>
              <span className="xs:hidden">Enlarge</span>
            </span>
          </div>
        )}
      </button>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-xl sm:p-6"
            onClick={() => setIsOpen(false)}
          >
            {/* Top Toolbar */}
            <div
              className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-[70vw] truncate">
                <p className="text-sm sm:text-base font-semibold text-white truncate">
                  {alt}
                </p>
                {caption && (
                  <p className="text-xs text-white/70 truncate">{caption}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
                  title="Open original / Download"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white focus:outline-none"
                  title="Close (Esc)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Main Full-Size Image Container */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
              }}
              className="relative flex max-h-[85vh] max-w-[95vw] sm:max-w-[90vw] flex-col items-center justify-center overflow-hidden rounded-2xl bg-black/50 p-1 sm:p-2 border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="max-h-[80vh] max-w-[90vw] sm:max-w-[85vw] h-auto w-auto rounded-xl object-contain shadow-2xl"
              />

              {caption && (
                <p className="mt-3 text-center text-xs sm:text-sm font-medium text-white/80 px-4 pb-1">
                  {caption}
                </p>
              )}
            </motion.div>

            {/* Bottom hint */}
            <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none">
              <span className="inline-block text-[11px] font-medium text-white/40 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                Press Esc or click outside to close
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
