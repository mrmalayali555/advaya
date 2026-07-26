"use client";

import { Crown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

export interface ResponsiveSize {
  "2xl"?: number | string;
  base?: number | string;
  lg?: number | string;
  md?: number | string;
  sm?: number | string;
  xl?: number | string;
}

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

const DEFAULT_CARD_WIDTH = 260;
const DEFAULT_ASPECT_RATIO = 1.35;

function formatSize(size: number | string): string {
  return typeof size === "number" ? `${size}px` : size;
}

function getInitialSize(
  size: number | string | ResponsiveSize | undefined,
  defaultValue: number | string
): string {
  if (!size) {
    return formatSize(defaultValue);
  }
  if (typeof size === "number" || typeof size === "string") {
    return formatSize(size);
  }
  if (size.base !== undefined) {
    return formatSize(size.base);
  }
  return formatSize(defaultValue);
}

function getSizeForBreakpoint(
  size: ResponsiveSize,
  width: number
): number | string | undefined {
  if (width >= breakpoints["2xl"]) {
    return size["2xl"] ?? size.xl ?? size.lg ?? size.md ?? size.sm ?? size.base;
  }
  if (width >= breakpoints.xl) {
    return size.xl ?? size.lg ?? size.md ?? size.sm ?? size.base;
  }
  if (width >= breakpoints.lg) {
    return size.lg ?? size.md ?? size.sm ?? size.base;
  }
  if (width >= breakpoints.md) {
    return size.md ?? size.sm ?? size.base;
  }
  if (width >= breakpoints.sm) {
    return size.sm ?? size.base;
  }
  return size.base;
}

function useResponsiveSize(
  size: number | string | ResponsiveSize | undefined,
  defaultValue: number | string
): string {
  const [currentSize, setCurrentSize] = useState<string>(() =>
    getInitialSize(size, defaultValue)
  );

  useEffect(() => {
    if (!size || typeof size === "number" || typeof size === "string") {
      return;
    }

    const updateSize = () => {
      const width = window.innerWidth;
      const selectedSize = getSizeForBreakpoint(size, width);

      if (selectedSize !== undefined) {
        const newSize = formatSize(selectedSize);
        setCurrentSize(newSize);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [size]);

  return currentSize;
}

function parseSize(size: string): number {
  const num = Number.parseFloat(size);
  return Number.isNaN(num) ? 0 : num;
}

function calculateHeightFromWidth(width: string, aspectRatio: number): string {
  const widthNum = parseSize(width);
  if (widthNum === 0) {
    return width;
  }
  const heightNum = widthNum * aspectRatio;
  return `${heightNum}px`;
}

export interface AchievementItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  date: Date;
  coverImage: string | null;
}

export interface AppleInvitesProps {
  achievements: AchievementItem[];
  interval?: number;
  className?: string;
  cardClassName?: string;
  cardWidth?: number | string | ResponsiveSize;
  cardHeight?: number | string | ResponsiveSize;
  aspectRatio?: number;
}

export default function AppleInvites({
  achievements,
  interval = 4000,
  className = "",
  cardClassName = "",
  cardWidth = DEFAULT_CARD_WIDTH,
  cardHeight,
  aspectRatio = DEFAULT_ASPECT_RATIO,
}: AppleInvitesProps) {
  const shouldReduceMotion = useReducedMotion();
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const responsiveWidth = useResponsiveSize(cardWidth, DEFAULT_CARD_WIDTH);

  const variants = useMemo(
    () => ({
      center: {
        x: "-50%",
        rotate: 0,
        scale: 1.05,
        opacity: 1,
        zIndex: 3,
        transition: shouldReduceMotion
          ? { duration: 0 }
          : {
              type: "spring" as const,
              stiffness: 300,
              damping: 30,
              duration: 0.25,
            },
      },
      left: {
        x: "-125%",
        rotate: -8,
        scale: 0.9,
        opacity: 0.7,
        zIndex: 2,
        transition: shouldReduceMotion
          ? { duration: 0 }
          : {
              type: "spring" as const,
              stiffness: 300,
              damping: 30,
              duration: 0.25,
            },
      },
      right: {
        x: "25%",
        rotate: 8,
        scale: 0.9,
        opacity: 0.7,
        zIndex: 2,
        transition: shouldReduceMotion
          ? { duration: 0 }
          : {
              type: "spring" as const,
              stiffness: 300,
              damping: 30,
              duration: 0.25,
            },
      },
      hidden: {
        opacity: 0,
        zIndex: 1,
        transition: shouldReduceMotion ? { duration: 0 } : { duration: 0.3 },
      },
    }),
    [shouldReduceMotion]
  );

  const explicitHeight = useResponsiveSize(
    cardHeight,
    calculateHeightFromWidth(responsiveWidth, aspectRatio)
  );
  const [calculatedHeight, setCalculatedHeight] = useState<string>(() =>
    calculateHeightFromWidth(responsiveWidth, aspectRatio)
  );

  useEffect(() => {
    if (cardHeight === undefined) {
      setCalculatedHeight(
        calculateHeightFromWidth(responsiveWidth, aspectRatio)
      );
    }
  }, [responsiveWidth, aspectRatio, cardHeight]);

  const responsiveHeight =
    cardHeight === undefined ? calculatedHeight : explicitHeight;

  const setPageWithDirection = (val: number, dir: number) => {
    setPage(val);
    setDirection(dir);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setPageWithDirection(page + 1, 1);
    }, interval);
    return () => clearInterval(timer);
  }, [page, interval]);

  if (!achievements || achievements.length === 0) return null;

  const activeIndex = wrap(0, achievements.length, page);

  const displayList = [...achievements];
  while (displayList.length < 3) {
    displayList.push(...achievements);
  }

  const visibleAchievements = [-1, 0, 1].map(
    (offset) => displayList[wrap(0, displayList.length, activeIndex + offset)]
  );

  const getVariant = (index: number) => {
    if (index === 1) return "center";
    if (index === 0) return "left";
    return "right";
  };

  return (
    <div className={`relative flex h-[480px] w-full items-center justify-center overflow-hidden py-8 ${className}`}>
      <AnimatePresence custom={direction} initial={false}>
        {visibleAchievements.map((achievement, index) => {
          const itemKey = `${achievement.id}-${index}`;
          return (
            <motion.div
              animate={getVariant(index)}
              className={`absolute top-1/2 left-1/2 origin-center -translate-y-1/2 ${cardClassName} select-none`}
              custom={direction}
              exit="hidden"
              initial="hidden"
              key={itemKey}
              style={{
                width: responsiveWidth,
                height: responsiveHeight,
              }}
              variants={variants}
              drag={index === 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(e, info) => {
                if (index === 1) {
                  if (info.offset.x < -50) {
                    setPageWithDirection(page + 1, 1);
                  } else if (info.offset.x > 50) {
                    setPageWithDirection(page - 1, -1);
                  }
                }
              }}
            >
              <Link
                href={`/achievements/${achievement.slug}`}
                className="relative block h-full w-full overflow-hidden rounded-3xl border border-white/20 bg-ink-900 shadow-2xl group"
              >
                {/* Image background */}
                {achievement.coverImage ? (
                  <Image
                    alt={achievement.title}
                    fill
                    sizes="280px"
                    priority
                    className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
                    src={achievement.coverImage}
                  />
                ) : (
                  <div className="absolute inset-0 bg-mesh opacity-70" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-transparent" />

                {/* Category Badge */}
                <div className="absolute z-10 top-4 left-4">
                  <span className="flex flex-row items-center rounded-full bg-purple-600/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    <Crown size={10} className="mr-1" />
                    {achievement.category}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 z-10 w-full p-5 text-white">
                  <p className="text-[10px] font-medium tracking-wider text-purple-300">
                    {formatDate(achievement.date)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm font-bold leading-tight group-hover:text-purple-300 transition-colors">
                    {achievement.title}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-xs text-white/70 leading-relaxed font-normal">
                    {achievement.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Manual controls */}
      <div className="absolute bottom-3 flex items-center gap-2 z-20">
        {achievements.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const diff = i - activeIndex;
              setPageWithDirection(page + diff, diff > 0 ? 1 : -1);
            }}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-7 bg-purple-600 shadow-md shadow-purple-600/40" : "w-2.5 bg-purple-600/30 hover:bg-purple-600/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
