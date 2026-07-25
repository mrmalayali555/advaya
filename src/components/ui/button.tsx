import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-500 ease-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-purple-600 text-white shadow-[0_8px_24px_-8px_rgba(91,42,134,0.6)] hover:bg-purple-700 hover:shadow-[0_12px_32px_-8px_rgba(91,42,134,0.7)] hover:-translate-y-0.5",
  secondary:
    "bg-ink-900 text-white hover:bg-ink-800 hover:-translate-y-0.5 shadow-[0_8px_24px_-10px_rgba(26,21,35,0.5)]",
  outline:
    "border border-ink-200 bg-white/60 text-ink-800 backdrop-blur hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700",
  ghost: "text-ink-700 hover:bg-ink-100 hover:text-purple-700",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Show a nested circular trailing arrow icon. */
  arrow?: boolean;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  arrow = false,
  external = false,
}: CommonProps & {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const content = (
    <>
      <span>{children}</span>
      {arrow && <ArrowIcon variant={variant} />}
    </>
  );
  const classes = cn(base, variants[variant], sizes[size], arrow && "pr-2", className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  CommonProps & ButtonHTMLAttributes<HTMLButtonElement>
>(function Button(
  { variant = "primary", size = "md", className, arrow, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], arrow && "pr-2", className)}
      {...props}
    >
      <span>{children}</span>
      {arrow && <ArrowIcon variant={variant} />}
    </button>
  );
});

function ArrowIcon({ variant }: { variant: Variant }) {
  const bg =
    variant === "primary" || variant === "secondary"
      ? "bg-white/15"
      : "bg-purple-600/10";
  return (
    <span
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-500 ease-brand group-hover:rotate-45",
        bg
      )}
    >
      <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
    </span>
  );
}
