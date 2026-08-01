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
    <img
      src="/logo.png"
      alt="ADVAYA Logo"
      className={cn("h-10 w-auto object-contain", className)}
    />
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
