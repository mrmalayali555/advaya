import Link from "next/link";
import React from "react";
import { Megaphone, ArrowRight } from "lucide-react";

export function MarqueeBar({
  text,
  buttonText,
  buttonUrl,
}: {
  text: string;
  buttonText?: string | null;
  buttonUrl?: string | null;
}) {
  // Duplicate content for a seamless infinite loop.
  const item = (
    <span className="mx-8 inline-flex items-center gap-3 text-sm font-medium">
      <Megaphone className="h-4 w-4 shrink-0 text-purple-200" strokeWidth={2} />
      {text}
      {buttonText && buttonUrl && (
        <Link
          href={buttonUrl}
          className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-0.5 text-xs font-semibold text-white transition-colors hover:bg-white/25"
        >
          {buttonText}
          <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </span>
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 py-2.5 text-white">
      <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
        <div className="flex shrink-0 items-center">
          {Array.from({ length: 10 }).map((_, i) => (
            <React.Fragment key={`m1-${i}`}>{item}</React.Fragment>
          ))}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {Array.from({ length: 10 }).map((_, i) => (
            <React.Fragment key={`m2-${i}`}>{item}</React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
