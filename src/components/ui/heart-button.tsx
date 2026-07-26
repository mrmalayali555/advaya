"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

function random(lower = 0, upper = 1, floating?: boolean) {
  if (upper === undefined) {
    upper = lower;
    lower = 0;
  }
  if (floating === true || !Number.isInteger(lower) || !Number.isInteger(upper)) {
    return Math.random() * (upper - lower) + lower;
  }
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

export function HeartButton({ className }: { className?: string }) {
  const [liked, setLiked] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; angle: number; distance: number }[]
  >([]);
  const nextId = useRef(0);

  const handleClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);

    if (newLiked) {
      const newParticles = Array.from({ length: 8 }).map(() => ({
        id: nextId.current++,
        angle: random(0, 360),
        distance: random(32, 48),
      }));
      setParticles(newParticles);

      setTimeout(() => {
        setParticles([]);
      }, 1200);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "particleButton relative inline-flex items-center justify-center p-3 rounded-full transition-colors cursor-pointer select-none group",
        className
      )}
      aria-label="Like this post"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
      >
        <path
          d="M3.68546 5.43796C8.61936 1.29159 11.8685 7.4309 12.0406 7.4309C12.2126 7.43091 15.4617 1.29159 20.3956 5.43796C26.8941 10.8991 13.5 21.8215 12.0406 21.8215C10.5811 21.8215 -2.81297 10.8991 3.68546 5.43796Z"
          className={liked ? "fill-purple-600 stroke-purple-600" : "stroke-purple-600 hover:stroke-purple-700"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Particle bursts */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle-burst absolute inset-0 m-auto w-3 h-3 rounded-full bg-purple-500 pointer-events-none"
          style={{
            "--angle": `${p.angle}deg`,
            "--distance": `${p.distance}px`,
          } as React.CSSProperties}
        />
      ))}

      <style jsx>{`
        .particle-burst {
          animation: fadeOut 1000ms forwards, disperse 500ms forwards cubic-bezier(0.2, 0.56, 0, 1);
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
          }
        }

        @keyframes disperse {
          to {
            transform: translate(
              calc(cos(var(--angle)) * var(--distance)),
              calc(sin(var(--angle)) * var(--distance))
            );
          }
        }
      `}</style>
    </button>
  );
}
