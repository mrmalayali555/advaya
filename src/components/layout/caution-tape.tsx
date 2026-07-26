"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CautionTape({
  text,
  buttonText,
  buttonUrl,
}: {
  text: string;
  buttonText?: string | null;
  buttonUrl?: string | null;
}) {
  return (
    <div className="caution-tape-wrapper">
      <div className="caution-tape">
        <div className="caution-tape-scroll">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={`t-${i}`} className="caution-tape-item">
              <span className="caution-tape-diamond">◆</span>
              <span className="caution-tape-text">{text}</span>
              {buttonText && buttonUrl && (
                <Link href={buttonUrl} className="caution-tape-btn">
                  {buttonText} <ArrowRight className="inline h-3 w-3" />
                </Link>
              )}
            </span>
          ))}
        </div>
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

        .caution-tape-scroll {
          display: flex;
          white-space: nowrap;
          animation: caution-scroll 40s linear infinite;
          background: linear-gradient(90deg, #f59e0b 0%, #eab308 50%, #f59e0b 100%);
          padding: 7px 0;
        }

        .caution-tape-item {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 0 24px;
          flex-shrink: 0;
        }

        .caution-tape-diamond {
          color: #1a1a1a;
          font-size: 8px;
          opacity: 0.6;
        }

        .caution-tape-text {
          font-family: var(--font-sora), system-ui, sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #1a1a1a;
        }

        .caution-tape-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(0, 0, 0, 0.85);
          color: #f59e0b;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s;
        }

        .caution-tape-btn:hover {
          background: rgba(0, 0, 0, 1);
        }

        @keyframes caution-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
