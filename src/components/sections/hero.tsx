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
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/70 via-white to-white pt-28 pb-0 sm:pt-36">
      
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

      {/* Content */}
      <div className="relative w-full">
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

            {/* CTAs — Two polished buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.28 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
            >
              {/* Primary CTA — Explore Events */}
              <ButtonLink
                href="/events"
                variant="primary"
                size="lg"
                className="hero-cta-primary group relative w-full overflow-hidden sm:w-auto"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Events
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </ButtonLink>

              {/* WhatsApp CTA — Join Community */}
              <a
                href="https://chat.whatsapp.com/HTnGS3oE7cIEzlG"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cta-whatsapp group inline-flex w-full items-center justify-center gap-2.5 sm:w-auto"
              >
                <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Join Our Community
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
