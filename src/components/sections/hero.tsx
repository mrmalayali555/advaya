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
import { FlowerHeartsBG } from "@/components/sections/flower-hearts-bg";
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

      {/* Blooming flowers & heart bubbles ambient background */}
      <FlowerHeartsBG />

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

            {/* Logo Mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
              className="mt-4 flex justify-center"
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
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg"
            >
              <EditableText type="setting" keyName="hero" field="subtitle">
                {subtitle}
              </EditableText>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.28 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            >
              <ButtonLink href="/events" variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-purple-600/20">
                Explore Events
              </ButtonLink>

              <ButtonLink href="/about" variant="secondary" size="lg" className="w-full sm:w-auto">
                About the Union
              </ButtonLink>

              <a
                href="https://chat.whatsapp.com/HTnGS3oE7cIEzlG"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition-transform duration-300 hover:scale-105"
              >
                Join WhatsApp Group
              </a>
            </motion.div>

            {/* Micro stats banner */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.36 }}
              className="mt-14 inline-flex flex-wrap items-center justify-center gap-6 rounded-3xl border border-ink-100/80 bg-white/70 px-6 py-4 shadow-[var(--shadow-lift)] backdrop-blur-md sm:gap-10 sm:px-10"
            >
              <div className="text-center">
                <div className="text-xl font-extrabold text-ink-900 sm:text-2xl">
                  <Counter value={stats.students} suffix="+" />
                </div>
                <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                  Medicos
                </div>
              </div>
              <div className="h-8 w-px bg-ink-100" />
              <div className="text-center">
                <div className="text-xl font-extrabold text-ink-900 sm:text-2xl">
                  <Counter value={stats.events} suffix="+" />
                </div>
                <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                  Annual Events
                </div>
              </div>
              <div className="h-8 w-px bg-ink-100" />
              <div className="text-center">
                <div className="text-xl font-extrabold text-ink-900 sm:text-2xl">
                  <Counter value={stats.achievements} suffix="+" />
                </div>
                <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                  Achievements
                </div>
              </div>
              <div className="h-8 w-px bg-ink-100" />
              <div className="text-center">
                <div className="text-xl font-extrabold text-ink-900 sm:text-2xl">
                  <Counter value={stats.committees} />
                </div>
                <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                  Sub-Committees
                </div>
              </div>
            </motion.div>

          </div>
        </Container>
      </div>

      {/* Caution Tape Marquee attached directly at bottom of hero */}
      {marquee && (
        <div className="mt-14 w-full">
          <CautionTape
            text={marquee.text}
            buttonText={marquee.buttonText}
            buttonUrl={marquee.buttonUrl}
            speed={marquee.speed ?? 8}
          />
        </div>
      )}
    </section>
  );
}
