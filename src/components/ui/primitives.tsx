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
        "inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-purple-700",
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
      <h2 className="text-3xl font-bold leading-[1.1] text-ink-900 sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg",
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
        "group relative overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-[var(--shadow-card)] transition-all duration-500 ease-brand",
        interactive &&
          "hover:-translate-y-1 hover:border-purple-200 hover:shadow-[var(--shadow-lift)]",
        className
      )}
    >
      {children}
    </div>
  );
}

type BadgeTone = "purple" | "silver" | "success" | "warning" | "danger" | "info" | "neutral";

const badgeTones: Record<BadgeTone, string> = {
  purple: "bg-purple-100 text-purple-700",
  silver: "bg-silver-200 text-ink-600",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  neutral: "bg-ink-100 text-ink-600",
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
