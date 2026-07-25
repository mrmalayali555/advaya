"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import { Container } from "@/components/ui/primitives";
import { Counter } from "@/components/ui/counter";

const EASE = [0.32, 0.72, 0, 1] as const;

export function Hero({
  badge,
  title,
  subtitle,
  stats,
}: {
  badge: string;
  title: string;
  subtitle: string;
  stats: { students: number; events: number; achievements: number; committees: number };
}) {
  return (
    <section className="relative overflow-hidden bg-surface pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-purple-300/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-40 h-80 w-80 rounded-full bg-purple-500/15 blur-[120px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(91,42,134,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(91,42,134,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 75%)",
        }}
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex justify-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-white/70 px-4 py-1.5 text-xs font-medium text-purple-700 shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-600" />
              </span>
              {badge}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
            className="mt-8 flex justify-center"
          >
            <LogoMark className="h-16 w-16 drop-shadow-[0_8px_24px_rgba(91,42,134,0.25)]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
            className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-6xl"
          >
            {title.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="text-gradient">
              {title.split(" ").slice(-2).join(" ")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-500"
          >
            {subtitle}
          </motion.p>

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
        </div>

        {/* Stats row */}
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
    <div className="rounded-3xl border border-ink-100 bg-white/70 p-6 text-center shadow-[var(--shadow-soft)] backdrop-blur">
      <div className="text-3xl font-bold text-gradient sm:text-4xl">
        <Counter value={value} suffix={suffix} />
      </div>
      <div className="mt-1 text-sm font-medium text-ink-500">{label}</div>
    </div>
  );
}
