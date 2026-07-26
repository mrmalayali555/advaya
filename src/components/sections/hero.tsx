"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import lottie from "lottie-web";
import { ButtonLink } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import { Container } from "@/components/ui/primitives";
import { Counter } from "@/components/ui/counter";
import { CautionTape } from "@/components/layout/caution-tape";
import { SITE } from "@/lib/site";
import { useVisualEdit, EditableText } from "@/components/admin/visual-editor";

const EASE = [0.32, 0.72, 0, 1] as const;

export function Hero({
  badge,
  title,
  subtitle,
  stats,
  marquee,
}: {
  badge: string;
  title: string;
  subtitle: string;
  stats: { students: number; events: number; achievements: number; committees: number };
  marquee?: { text: string; buttonText?: string | null; buttonUrl?: string | null; speed?: number } | null;
}) {
  const { isEditMode } = useVisualEdit();
  
  const riderContainerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animationPlayed, setAnimationPlayed] = useState(false);

  useEffect(() => {
    // Check if animation has already played in this session to prevent repeating
    if (sessionStorage.getItem("rider_played") === "true") {
      setAnimationPlayed(true);
      return;
    }
    
    // Skip animation if prefers-reduced-motion is true
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimationPlayed(true);
      sessionStorage.setItem("rider_played", "true");
      return;
    }

    const container = riderContainerRef.current;
    const content = contentWrapperRef.current;
    const section = sectionRef.current;

    if (!container || !content || !section) return;

    // Load Lottie animation
    const anim = lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/Rider.json", // Served statically from public/Rider.json
    });

    // Set initial positions
    // Initially: hero content is hidden with clip-path
    gsap.set(content, { clipPath: "inset(0 100% 0 0)" });
    
    // Calculate responsive metrics
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth < 640;
    const riderWidth = isMobile ? 110 : 180; // responsive rider size
    const startX = viewportWidth + 100;
    const turnX = isMobile ? 30 : 120; // how close to the left edge they get before turning
    const endX = isMobile ? viewportWidth - riderWidth - 20 : viewportWidth - riderWidth - 100; // settle point on the right

    // Vertical placement
    const riderY = isMobile ? "68%" : "40%";

    gsap.set(container, {
      x: startX,
      y: riderY,
      scaleX: 1, // Facing left initially (traveling right -> left)
      width: riderWidth,
      height: riderWidth,
      position: "absolute",
    });

    // Create GSAP Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Remove clip-path/transforms to restore full interactivity
        gsap.set(content, { clearProps: "clipPath" });
        setAnimationPlayed(true);
        sessionStorage.setItem("rider_played", "true");
      }
    });

    // PHASE 2: Move right to left (Rider traveling right to left, facing left)
    // Decelerating near the turn point
    tl.to(container, {
      x: turnX,
      duration: isMobile ? 2.0 : 2.8,
      ease: "power2.out",
    });

    // PHASE 3: Turnaround (horizontally flip scaleX to -1)
    // Slight squash/stretch during turnaround
    tl.to(container, {
      scaleX: -1,
      scaleY: 1.1,
      duration: 0.3,
      ease: "back.out(2)",
    });
    tl.to(container, {
      scaleY: 1.0,
      duration: 0.1,
    });

    // PHASE 4: Move left to right, and reveal hero content dynamically
    // The reveal boundary follows the rider's X position.
    tl.to(container, {
      x: endX,
      duration: isMobile ? 2.2 : 3.2,
      ease: "power1.inOut",
      onUpdate: function () {
        const currentX = gsap.getProperty(container, "x") as number;
        // Map currentX to inset percentage
        const progress = (currentX - turnX) / (endX - turnX);
        const clampedProgress = Math.max(0, Math.min(1, progress));
        const revealPercentage = 100 - clampedProgress * 100;
        gsap.set(content, {
          clipPath: `inset(0 ${revealPercentage}% 0 0)`
        });
      }
    });

    return () => {
      tl.kill();
      anim.destroy();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-purple-50/70 via-white to-white pt-28 pb-0 sm:pt-36">
      
      {/* Light elegant decorative mesh glows */}
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-40" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[450px] w-[450px] rounded-full bg-purple-300/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/2 bottom-0 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-500/5 blur-[80px]" />

      {/* Background grids */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(91,42,134,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(91,42,134,0.03) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 75%)",
        }}
      />

      {/* Lottie Animation Rider Container */}
      {!animationPlayed && (
        <div ref={riderContainerRef} className="absolute pointer-events-none z-45" />
      )}

      {/* Content Wrapper for dynamic clipping reveal */}
      <div ref={contentWrapperRef} className="relative w-full">
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex justify-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-white/80 px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-sm backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-600" />
                </span>
                <EditableText type="setting" keyName="hero" field="badge">
                  {badge}
                </EditableText>
              </span>
            </motion.div>

            {/* Logo Mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
              className="mt-8 flex justify-center"
            >
              <LogoMark className="h-16 w-16 drop-shadow-[0_8px_24px_rgba(91,42,134,0.15)]" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
              className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-ink-900 sm:text-6xl"
            >
              {isEditMode ? (
                <EditableText type="setting" keyName="hero" field="title">
                  {title}
                </EditableText>
              ) : (
                <>
                  {title.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className="text-gradient">
                    {title.split(" ").slice(-2).join(" ")}
                  </span>
                </>
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg"
            >
              <EditableText type="setting" keyName="hero" field="subtitle">
                {subtitle}
              </EditableText>
            </motion.p>

            {/* Explore actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.28 }}
              className="mt-9 flex flex-wrap items-center justify-center gap-3"
            >
              <ButtonLink href="/events" size="lg" arrow>
                Explore Events
              </ButtonLink>
              <ButtonLink href="/about" size="lg" variant="outline">
                About the Union
              </ButtonLink>
            </motion.div>

            {/* Premium Light Social buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <a
                href={SITE.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-5 py-2.5 text-sm font-semibold text-green-700 shadow-sm transition-all duration-300 hover:border-green-400 hover:bg-green-50/50 hover:shadow-md"
              >
                <svg className="h-4.5 w-4.5 text-green-600 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Join WhatsApp Group
              </a>
              <a
                href={SITE.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-5 py-2.5 text-sm font-semibold text-pink-700 shadow-sm transition-all duration-300 hover:border-pink-400 hover:bg-pink-50/50 hover:shadow-md"
              >
                <svg className="h-4.5 w-4.5 text-pink-600 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Follow on Instagram
              </a>
            </motion.div>
          </div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.36 }}
            className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
          >
            <Stat value={stats.students} suffix="+" label="Students" />
            <Stat value={stats.events} suffix="+" label="Events" />
            <Stat value={stats.achievements} suffix="+" label="Achievements" />
            <Stat value={stats.committees} label="Committees" />
          </motion.div>
        </Container>
      </div>

      {/* Caution tape marquee at the bottom of hero with speed control support */}
      {marquee && (
        <div className="mt-14">
          <CautionTape
            text={marquee.text}
            buttonText={marquee.buttonText}
            buttonUrl={marquee.buttonUrl}
            speed={marquee.speed}
          />
        </div>
      )}
    </section>
  );
}

function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="rounded-3xl border border-purple-100 bg-white/70 p-6 text-center shadow-[var(--shadow-soft)] backdrop-blur">
      <div className="text-3xl font-bold text-gradient sm:text-4xl">
        <Counter value={value} suffix={suffix} />
      </div>
      <div className="mt-1 text-sm font-semibold text-ink-500">{label}</div>
    </div>
  );
}
