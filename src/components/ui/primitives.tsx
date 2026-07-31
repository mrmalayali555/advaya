import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

/** Max-width page container. */
export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-7xl",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Microscopic pill label above headings. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-900/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-purple-300",
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-bold leading-[1.1] text-on-surface sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/** Concentric double-bezel card shell. */
export function Card({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-white/5 bg-surface-container shadow-[var(--shadow-card)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
        interactive &&
          "hover:-translate-y-1 hover:border-white/10 hover:shadow-[0_8px_32px_rgba(120,0,255,0.15)]",
        className
      )}
    >
      {children}
    </div>
  );
}

type BadgeTone = "purple" | "silver" | "success" | "warning" | "danger" | "info" | "neutral";

const badgeTones: Record<BadgeTone, string> = {
  purple: "bg-purple-900/30 text-purple-300 border border-purple-500/20",
  silver: "bg-white/10 text-white/80 border border-white/10",
  success: "bg-emerald-900/30 text-emerald-300 border border-emerald-500/20",
  warning: "bg-amber-900/30 text-amber-300 border border-amber-500/20",
  danger: "bg-red-900/30 text-red-300 border border-red-500/20",
  info: "bg-blue-900/30 text-blue-300 border border-blue-500/20",
  neutral: "bg-white/5 text-white/70 border border-white/10",
};

export function Badge({
  children,
  tone = "purple",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}
