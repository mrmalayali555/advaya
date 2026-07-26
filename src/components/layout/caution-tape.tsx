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
          <ArrowRight className="inline h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
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
          color: #1a1a1a;
          font-size: 9px;
          opacity: 0.7;
        }

        .caution-tape-text {
          font-family: 'Unbounded', 'Syne', system-ui, sans-serif !important;
          font-size: 12px;
          font-weight: 900 !important;
          letter-spacing: 0.14em !important;
          text-transform: uppercase !important;
          color: #1a1a1a !important;
        }

        .caution-tape-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #1a1523;
          color: #ffffff;
          padding: 5px 14px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.25s ease;
        }

        .caution-tape-btn:hover {
          background: #5b2a86;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(91, 42, 134, 0.4);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
