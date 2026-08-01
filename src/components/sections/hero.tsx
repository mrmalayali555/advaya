"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import { Container } from "@/components/ui/primitives";
import { Counter } from "@/components/ui/counter";
import { CautionTape } from "@/components/layout/caution-tape";
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

  return (
    <section className="relative overflow-hidden pt-28 pb-0 sm:pt-36 bg-[#050208]">
      {/* === Background Setup === */}
      <div className="absolute inset-0 z-0 w-full h-full bg-[#08080a]"></div>
      
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 w-full h-full bg-cover bg-center opacity-40 mix-blend-screen pointer-events-none" 
        style={{ backgroundImage: "url('/hero-bg-violet.png')" }}
      ></div>
      {/* Procedural Noise Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>
      
      {/* Radial Glow behind text */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 bg-purple-500/20 blur-[120px] rounded-full z-0 w-[800px] max-w-[90vw] h-[400px] pointer-events-none"></div>
      {/* Content */}
      <div className="relative z-10 w-full">
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">



            {/* Logo Mark (Hidden in new design) */}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
              className="mt-4 font-bold tracking-[0.15em] sm:tracking-[0.25em] leading-tight whitespace-nowrap text-on-surface"
              style={{ fontSize: "clamp(1.5rem, 5vw, 5.5rem)" }}
            >
              {isEditMode ? (
                <EditableText type="setting" keyName="hero" field="title">
                  {title}
                </EditableText>
              ) : (
                <>{title}</>
              )}
            </motion.h1>

            {/* College Name */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
              className="mt-2 font-sans text-sm tracking-widest text-primary/80 uppercase font-medium"
            >
              Gov TD Medical College Alappuzha
            </motion.p>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg"
            >
              <EditableText type="setting" keyName="hero" field="subtitle">
                {subtitle}
              </EditableText>
            </motion.p>

            {/* CTAs — Two polished buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.28 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
            >
              {/* Primary CTA — Explore Events */}
              <a
                href="/events"
                className="glow-button inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-on-primary transition-all sm:w-auto"
              >
                Explore Events
              </a>

              {/* WhatsApp CTA — Join Community */}
              <a
                href="https://chat.whatsapp.com/HTnGS3oE7cIEzlG"
                target="_blank"
                rel="noopener noreferrer"
                className="glow-button inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-transparent px-8 text-sm font-semibold text-white transition-all hover:bg-white/5 sm:w-auto"
              >
                Join Our Community
              </a>
            </motion.div>

          </div>

        {/* Dark glass bento stats - Moved outside max-w-3xl to allow max-w-5xl width */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.36 }}
            className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 w-full max-w-5xl mx-auto"
          >
            <div className="glass-card rounded-2xl p-8 text-center shadow-lg transition-transform hover:-translate-y-1">
              <div className="font-display-md text-primary font-black text-4xl sm:text-[3rem] leading-none">
                <Counter value={stats.students} suffix="+" />
              </div>
              <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
                Medicos
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8 text-center shadow-lg transition-transform hover:-translate-y-1">
              <div className="font-display-md text-primary font-black text-4xl sm:text-[3rem] leading-none">
                <Counter value={stats.events} suffix="+" />
              </div>
              <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
                Annual Events
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8 text-center shadow-lg transition-transform hover:-translate-y-1">
              <div className="font-display-md text-primary font-black text-4xl sm:text-[3rem] leading-none">
                <Counter value={stats.achievements} suffix="+" />
              </div>
              <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
                Achievements
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8 text-center shadow-lg transition-transform hover:-translate-y-1">
              <div className="font-display-md text-primary font-black text-4xl sm:text-[3rem] leading-none">
                <Counter value={stats.committees} />
              </div>
              <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
                Sub-Committees
              </div>
            </div>
          </motion.div>
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

      {/* Hero CTA styles */}
      <style jsx>{`
        .hero-cta-primary {
          background: linear-gradient(135deg, #7c3aed 0%, #5b2a86 50%, #4c1d95 100%) !important;
          border: none !important;
          padding: 14px 32px !important;
          border-radius: 16px !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          letter-spacing: 0.01em !important;
          color: #ffffff !important;
          box-shadow: 0 8px 32px rgba(91, 42, 134, 0.35), 0 2px 8px rgba(91, 42, 134, 0.2) !important;
          transition:
            transform 200ms cubic-bezier(0.32, 0.72, 0, 1),
            box-shadow 200ms cubic-bezier(0.32, 0.72, 0, 1),
            background 200ms cubic-bezier(0.32, 0.72, 0, 1) !important;
        }
        .hero-cta-primary:hover {
          box-shadow: 0 12px 40px rgba(91, 42, 134, 0.5), 0 4px 16px rgba(91, 42, 134, 0.3) !important;
          transform: translateY(-2px) !important;
        }
        .hero-cta-primary:active {
          transform: translateY(0px) scale(0.97) !important;
        }
        .hero-cta-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
        }
        .hero-cta-whatsapp {
          padding: 13px 28px;
          border-radius: 16px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.01em;
          color: #1a1a1a;
          background: rgba(255, 255, 255, 0.85);
          border: 2px solid rgba(37, 211, 102, 0.4);
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.12);
          transition:
            transform 200ms cubic-bezier(0.32, 0.72, 0, 1),
            box-shadow 200ms cubic-bezier(0.32, 0.72, 0, 1),
            background 200ms cubic-bezier(0.32, 0.72, 0, 1),
            color 200ms cubic-bezier(0.32, 0.72, 0, 1),
            border-color 200ms cubic-bezier(0.32, 0.72, 0, 1);
          text-decoration: none;
        }
        .hero-cta-whatsapp:hover {
          background: #25D366;
          color: #ffffff;
          border-color: #25D366;
          box-shadow: 0 8px 32px rgba(37, 211, 102, 0.35);
          transform: translateY(-2px);
        }
        .hero-cta-whatsapp:active {
          transform: translateY(0px) scale(0.97);
        }
        .hero-cta-whatsapp svg {
          color: #25D366;
          transition: color 0.35s ease;
        }
        .hero-cta-whatsapp:hover svg {
          color: #ffffff;
        }
      `}</style>
    </section>
  );
}
