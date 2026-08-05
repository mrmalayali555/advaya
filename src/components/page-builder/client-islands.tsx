"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Plus, Minus, X } from "lucide-react";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import { Reveal } from "@/components/ui/reveal";
import type { 
  FaqItem, 
  CountdownData, 
  AnnouncementData, 
  GalleryData,
  StatItem
} from "@/lib/page-builder-types";

// ──────────────────────────────────────────────────────────────────────────────
// FAQ Island
// ──────────────────────────────────────────────────────────────────────────────
export function FaqIsland({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="glass-card overflow-hidden rounded-2xl border border-white/10 bg-surface-container"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between p-6 text-left"
            >
              <span className="text-lg font-semibold text-on-surface">
                {item.question}
              </span>
              <span className="ml-4 shrink-0 text-purple-400">
                {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </span>
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="p-6 pt-0 text-on-surface-variant prose prose-invert max-w-none">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Countdown Island
// ──────────────────────────────────────────────────────────────────────────────
function CountdownBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="glass-card flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-900/30 text-3xl font-bold text-purple-300 sm:h-24 sm:w-24 sm:text-5xl">
        {value.toString().padStart(2, "0")}
      </div>
      <span className="mt-3 text-sm font-medium uppercase tracking-widest text-on-surface-variant">
        {label}
      </span>
    </div>
  );
}

export function CountdownIsland({ data }: { data: CountdownData }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  } | null>(null);

  useEffect(() => {
    const target = new Date(data.targetDate).getTime();
    
    const tick = () => {
      const now = new Date().getTime();
      const difference = target - now;
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        expired: false,
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [data.targetDate]);

  if (!timeLeft) return <div className="h-32 skeleton rounded-2xl" />;

  if (timeLeft.expired) {
    if (data.hideAfterExpiry) return null;
    return (
      <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-8 text-center bg-surface-container">
        <h3 className="text-2xl font-bold text-on-surface">{data.label}</h3>
        <p className="mt-2 text-on-surface-variant">Event has passed</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <h3 className="mb-2 text-2xl font-bold text-on-surface sm:text-3xl">{data.label}</h3>
      {data.description && (
        <p className="mb-8 text-on-surface-variant">{data.description}</p>
      )}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        <CountdownBox label="Days" value={timeLeft.days} />
        <CountdownBox label="Hours" value={timeLeft.hours} />
        <CountdownBox label="Mins" value={timeLeft.minutes} />
        <CountdownBox label="Secs" value={timeLeft.seconds} />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Gallery Island
// ──────────────────────────────────────────────────────────────────────────────
export function GalleryIsland({ data }: { data: GalleryData }) {
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const items = data.images.map((img) => ({
    url: img.url,
    caption: img.caption || null,
  }));

  const colClass = 
    data.columns === 1 ? "grid-cols-1" :
    data.columns === 2 ? "grid-cols-1 sm:grid-cols-2" :
    data.columns === 3 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" :
    "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";

  return (
    <>
      <div className={cn("grid gap-4", colClass)}>
        {data.images.map((img, index) => (
          <button
            key={img.id}
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-surface-container-high outline-none ring-purple-500 transition-all focus-visible:ring-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.caption || ""}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4 pt-12 text-left">
                <p className="text-sm font-medium text-white">{img.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>
      {lightboxIndex >= 0 && (
        <GalleryLightbox
          photos={items}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
        />
      )}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Announcement Island
// ──────────────────────────────────────────────────────────────────────────────
export function AnnouncementIsland({ data }: { data: AnnouncementData }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const toneClass = {
    info: "bg-blue-900/30 text-blue-100 border-blue-500/20",
    warning: "bg-amber-900/30 text-amber-100 border-amber-500/20",
    success: "bg-emerald-900/30 text-emerald-100 border-emerald-500/20",
    urgent: "bg-red-900/30 text-red-100 border-red-500/20",
  }[data.type];

  return (
    <div className={cn("relative flex items-center justify-between rounded-xl border p-4 shadow-soft", toneClass)}>
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium leading-relaxed sm:text-base">
          {data.text}
        </p>
        {data.linkUrl && (
          <a
            href={data.linkUrl}
            className="shrink-0 whitespace-nowrap rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold hover:bg-white/20"
          >
            {data.linkText || "Learn More"}
          </a>
        )}
      </div>
      {data.dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="ml-4 shrink-0 rounded-full p-1 opacity-70 hover:bg-white/10 hover:opacity-100 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Stats Island (Counter animation)
// ──────────────────────────────────────────────────────────────────────────────
export function StatsIsland({ items }: { items: StatItem[] }) {
  // Simple CSS implementation is usually fine, but since we are allowed a client component, 
  // we could do a count-up. For simplicity and reliability in React, we'll just render them 
  // with basic styling inside a reveal.

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
      {items.map((stat, i) => (
        <Reveal key={stat.id} delay={i * 0.1}>
          <div className="glass-card flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-surface-container p-6 text-center">
            <div className="text-4xl font-bold tracking-tight text-purple-300 sm:text-5xl">
              {stat.value}
            </div>
            <div className="mt-2 text-sm font-medium uppercase tracking-wider text-on-surface-variant">
              {stat.label}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
