import { cn } from "@/lib/utils";

/**
 * ADVAYA brand mark — a silver "A" chevron crossed by the purple swoosh,
 * an SVG rendition of the supplied logo. Replace with /public/logo.png
 * via the <img> path if an exact asset is preferred.
 */
export function LogoMark({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const id = "adv";
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("h-9 w-9", className)}
      role="img"
      aria-label="ADVAYA"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${id}-silver`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={variant === "dark" ? "#ffffff" : "#ffffff"} />
          <stop offset="45%" stopColor="#d4d4dc" />
          <stop offset="65%" stopColor="#9a9aa4" />
          <stop offset="100%" stopColor="#e8e8ed" />
        </linearGradient>
        <linearGradient id={`${id}-purple`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b79bd4" />
          <stop offset="55%" stopColor="#5b2a86" />
          <stop offset="100%" stopColor="#391a57" />
        </linearGradient>
      </defs>
      {/* The A chevron */}
      <path
        d="M50 14 L82 86 L69 86 L50 40 L31 86 L18 86 Z"
        fill={`url(#${id}-silver)`}
      />
      {/* The purple swoosh */}
      <path
        d="M20 66 C40 52 62 52 84 40 C64 60 42 62 22 74 Z"
        fill={`url(#${id}-purple)`}
      />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
  variant = "dark",
}: {
  className?: string;
  showWordmark?: boolean;
  variant?: "light" | "dark";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark variant={variant} />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "text-lg font-bold tracking-[0.25em]",
              variant === "dark" ? "text-white" : "text-silver"
            )}
          >
            ADVAYA
          </span>
          <span
            className={cn(
              "text-[10px] font-medium tracking-[0.3em]",
              variant === "dark" ? "text-white/50" : "text-ink-400"
            )}
          >
            അദ്വയ
          </span>
        </span>
      )}
    </span>
  );
}
