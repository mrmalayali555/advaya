"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CautionTape({
  text,
  buttonText,
  buttonUrl,
  speed = 8,
}: {
  text: string;
  buttonText?: string | null;
  buttonUrl?: string | null;
  speed?: number;
}) {
  const [currentSpeed, setCurrentSpeed] = useState(speed);

  const items = Array.from({ length: 8 }).map((_, i) => (
    <span key={`t-${i}`} className="caution-tape-item">
      <span className="caution-tape-diamond">◆</span>
      <span className="caution-tape-text font-marquee">{text}</span>
      {buttonText && buttonUrl && (
        <Link href={buttonUrl} className="caution-tape-btn font-sans group">
          <span>{buttonText}</span>
          <ArrowRight className="inline h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </span>
  ));

  const MarqueeTag = "marquee" as any;

  return (
    <div 
      className="caution-tape-wrapper"
      onMouseEnter={() => setCurrentSpeed(Math.max(2, Math.floor(speed / 3)))}
      onMouseLeave={() => setCurrentSpeed(speed)}
    >
      <div className="caution-tape">
        <MarqueeTag scrollamount={currentSpeed} className="caution-tape-scroll">
          <div className="flex items-center">
            {items}
          </div>
        </MarqueeTag>
      </div>

      <style jsx>{`
        .caution-tape-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          z-index: 20;
          margin-top: -8px;
          transform: rotate(-1.2deg);
          transform-origin: left center;
          cursor: pointer;
        }

        .caution-tape {
          background: repeating-linear-gradient(
            -45deg,
            #f59e0b,
            #f59e0b 10px,
            #1a1a1a 10px,
            #1a1a1a 20px
          );
          padding: 2px 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.2);
        }

        :global(.caution-tape-scroll) {
          background: linear-gradient(90deg, #f59e0b 0%, #eab308 50%, #f59e0b 100%) !important;
          padding: 7px 0 !important;
          display: block !important;
        }

        .caution-tape-item {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 0 24px;
          white-space: nowrap;
        }

        .caution-tape-diamond {
          color: #000000 !important;
          font-size: 9px;
          opacity: 0.9;
        }

        .caution-tape-text {
          font-family: var(--font-unbounded), var(--font-display), system-ui, sans-serif !important;
          font-size: 12px;
          font-weight: 900 !important;
          letter-spacing: 0.14em !important;
          text-transform: uppercase !important;
          color: #000000 !important;
        }

        :global(.caution-tape-btn) {
          display: inline-flex !important;
          align-items: center !important;
          gap: 7px !important;
          background: linear-gradient(135deg, #5b2a86, #7c3aed) !important;
          color: #ffffff !important;
          padding: 6px 18px !important;
          border-radius: 9999px !important;
          font-size: 11.5px !important;
          font-weight: 800 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          text-decoration: none !important;
          box-shadow: 0 3px 12px rgba(91, 42, 134, 0.45), inset 0 1px 0 rgba(255,255,255,0.2) !important;
          border: 2px solid rgba(255, 255, 255, 0.5) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
          overflow: hidden !important;
        }

        :global(.caution-tape-btn)::before {
          content: '' !important;
          position: absolute !important;
          inset: 0 !important;
          background: linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%) !important;
          background-size: 250% 100% !important;
          animation: btnShimmer 2.5s ease-in-out infinite !important;
        }

        :global(.caution-tape-btn:hover) {
          background: linear-gradient(135deg, #7c3aed, #a855f7) !important;
          box-shadow: 0 6px 20px rgba(91, 42, 134, 0.6), inset 0 1px 0 rgba(255,255,255,0.3) !important;
          transform: translateY(-2px) scale(1.05) !important;
          border-color: rgba(255, 255, 255, 0.7) !important;
        }

        @keyframes btnShimmer {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
