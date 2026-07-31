"use client";

import { useEffect, useRef, type ReactNode } from "react";

// ─── CSS-based reveal — no framer-motion needed for basic scroll reveals ───
// Uses IntersectionObserver + CSS transitions. The same visual effect as the
// framer-motion version but with zero JS bundle overhead for the animation lib.

const BRAND_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

function useReveal(ref: React.RefObject<HTMLElement | null>, delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion immediately
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = `opacity 0.7s ${BRAND_EASE} ${delay}s, transform 0.7s ${BRAND_EASE} ${delay}s`;
    el.style.willChange = "opacity, transform";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          // Clean up will-change after animation completes
          setTimeout(() => { el.style.willChange = "auto"; }, (0.7 + delay) * 1000);
          observer.disconnect();
        }
      },
      { rootMargin: "-80px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, delay]);
}

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, delay);
  return <Tag ref={ref} className={className}>{children}</Tag>;
}

/** Stagger container — children using RevealItem animate in sequence. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(container.querySelectorAll<HTMLElement>("[data-reveal-item]"));

    if (prefersReduced) {
      items.forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
      return;
    }

    items.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = `opacity 0.6s ${BRAND_EASE} ${i * stagger}s, transform 0.6s ${BRAND_EASE} ${i * stagger}s`;
      el.style.willChange = "opacity, transform";
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          items.forEach((el, i) => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            setTimeout(() => { el.style.willChange = "auto"; }, (0.6 + i * stagger) * 1000);
          });
          observer.disconnect();
        }
      },
      { rootMargin: "-60px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [stagger]);

  return <div ref={ref} className={className}>{children}</div>;
}

export function RevealItem({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  return <Tag data-reveal-item className={className}>{children}</Tag>;
}
