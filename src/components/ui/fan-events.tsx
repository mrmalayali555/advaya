"use client";

import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: Date;
  time: string | null;
  venue: string | null;
  poster: string | null;
  status: string;
}

export function FanEvents({ events }: { events: EventItem[] }) {
  if (!events || events.length === 0) return null;

  // Take top 3 events
  const displayEvents = events.slice(0, 3);
  
  // Custom rotations for the fan effect
  const rotations = [-12, 0, 12];

  return (
    <div className="fan-events-container py-16 flex justify-center items-center">
      <div className="fan-deck">
        {displayEvents.map((event, index) => {
          const rotation = rotations[index] ?? 0;
          return (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="fan-card group"
              style={{ "--r": rotation } as React.CSSProperties}
            >
              {/* Card Glow / Background lights */}
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-purple-500/25 to-pink-500/25 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" />
              
              <div className="relative h-full w-full bg-white/70 border border-purple-100/50 backdrop-blur-lg rounded-2xl p-6 shadow-xl shadow-purple-900/5 flex flex-col justify-between overflow-hidden transition-all duration-300">
                
                {/* Event Poster / Abstract Mesh Background */}
                {event.poster ? (
                  <div 
                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 bg-cover bg-center"
                    style={{ backgroundImage: `url(${event.poster})` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-mesh opacity-20" />
                )}
                
                {/* Status Badge */}
                <div className="flex justify-between items-start z-10">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                    event.status === "upcoming" 
                      ? "bg-purple-100 text-purple-700" 
                      : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {event.status}
                  </span>
                  <div className="text-xs font-semibold text-purple-600/80 bg-purple-50 px-2 py-0.5 rounded-md">
                    {formatDate(event.date).split(" ")[0]} {formatDate(event.date).split(" ")[1]}
                  </div>
                </div>

                {/* Event Details */}
                <div className="mt-8 flex-1 flex flex-col justify-end z-10">
                  <h3 className="text-lg font-bold text-ink-900 line-clamp-2 leading-snug group-hover:text-purple-700 transition-colors">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-xs text-ink-500 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                  
                  {/* Meta items */}
                  <div className="mt-4 pt-3 border-t border-purple-50/50 space-y-1 text-xs text-ink-500">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-purple-500" />
                      <span>{formatDate(event.date)} {event.time ? ` · ${event.time}` : ""}</span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-purple-500" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* View Details Hover Reveal */}
                <div className="absolute bottom-0 inset-x-0 h-10 bg-purple-600 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                  <span className="text-xs font-bold text-white tracking-wider uppercase">View Event Details</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .fan-events-container {
          perspective: 1000px;
          width: 100%;
        }

        .fan-deck {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 600px;
          height: 320px;
        }

        :global(.fan-card) {
          position: absolute;
          width: 250px;
          height: 290px;
          transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
          border-radius: 1rem;
          transform: rotate(calc(var(--r) * 1deg)) translateZ(0);
          transform-origin: center bottom;
          will-change: transform, margin;
        }

        /* Order layering */
        :global(.fan-card):nth-child(1) {
          z-index: 10;
          margin-left: -140px;
        }
        :global(.fan-card):nth-child(2) {
          z-index: 20;
          margin-left: 0;
        }
        :global(.fan-card):nth-child(3) {
          z-index: 10;
          margin-left: 140px;
        }

        /* Hover fanning out effect */
        .fan-deck:hover :global(.fan-card) {
          transform: rotate(0deg) translateZ(10px);
        }

        .fan-deck:hover :global(.fan-card):nth-child(1) {
          margin-left: -280px;
          transform: rotate(-4deg);
        }
        .fan-deck:hover :global(.fan-card):nth-child(2) {
          margin-left: 0;
          transform: scale(1.05);
          z-index: 30;
        }
        .fan-deck:hover :global(.fan-card):nth-child(3) {
          margin-left: 280px;
          transform: rotate(4deg);
        }

        @media (max-width: 640px) {
          .fan-deck {
            height: auto;
            flex-direction: column;
            gap: 1.5rem;
          }

          :global(.fan-card) {
            position: relative !important;
            width: 100% !important;
            max-width: 320px;
            height: 260px;
            transform: none !important;
            margin: 0 !important;
          }

          .fan-deck:hover :global(.fan-card) {
            transform: none !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
