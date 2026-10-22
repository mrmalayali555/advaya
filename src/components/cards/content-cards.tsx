import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, MapPin, FileText, Download, Users } from "lucide-react";
import { Badge, Card } from "@/components/ui/primitives";
import { formatDate, formatEventDate } from "@/lib/utils";

type CategoryTone = Record<string, "purple" | "info" | "success" | "warning">;
const achTone: CategoryTone = {
  sports: "info",
  arts: "purple",
  academics: "success",
};
const statusTone: Record<string, "info" | "success" | "danger"> = {
  upcoming: "info",
  completed: "success",
  cancelled: "danger",
};

function CoverImage({ src, alt }: { src?: string | null; alt: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 400px"
        className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
      />
    );
  }
  return (
    <div className="absolute inset-0 bg-mesh">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl font-bold tracking-widest text-purple-300/50">
          {alt.slice(0, 1).toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export function AchievementCard({
  achievement,
}: {
  achievement: {
    title: string;
    slug: string;
    category: string;
    description: string;
    date: Date;
    coverImage: string | null;
  };
}) {
  return (
    <Card interactive className="flex h-full flex-col rounded-[1.5rem] sm:rounded-[2rem]">
      <Link href={`/achievements/${achievement.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          <CoverImage src={achievement.coverImage} alt={achievement.title} />
          <div className="absolute left-2.5 top-2.5 sm:left-4 sm:top-4">
            <Badge
              tone={achTone[achievement.category] ?? "purple"}
              className="px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-xs"
            >
              {achievement.category}
            </Badge>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-3.5 sm:p-6">
          <time className="text-[10px] font-medium text-white/50 sm:text-xs">
            {formatDate(achievement.date)}
          </time>
          <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-on-surface transition-colors group-hover:text-purple-300 sm:mt-2 sm:text-lg">
            {achievement.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 flex-1 text-[11px] leading-[1.45] text-on-surface-variant sm:mt-2 sm:text-sm sm:leading-relaxed">
            {achievement.description}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-purple-400 sm:mt-4 sm:text-sm">
            View achievement
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4" />
          </span>
        </div>
      </Link>
    </Card>
  );
}

export function EventCard({
  event,
}: {
  event: {
    title: string;
    slug: string;
    description: string;
    date: Date | null;
    dateText: string | null;
    endDate: Date | null;
    time: string | null;
    venue: string | null;
    poster: string | null;
    status: string;
    committee?: { name: string; slug: string } | null;
    committees?: { name: string; slug: string }[];
  };
}) {
  return (
    <Card interactive className="flex h-full flex-col rounded-[1.5rem] sm:rounded-[2rem]">
      <Link href={`/events/${event.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          <CoverImage src={event.poster} alt={event.title} />
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-1.5">
            <Badge
              tone={statusTone[event.status] ?? "info"}
              className="px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-xs"
            >
              {event.status}
            </Badge>
          </div>
          {(() => {
            const allCommittees = [
              ...(event.committee ? [event.committee] : []),
              ...(event.committees || []),
            ].filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i);

            if (allCommittees.length === 0) return null;
            return (
              <div className="absolute bottom-2 right-2 flex max-w-[78%] flex-wrap justify-end gap-1 sm:bottom-3 sm:right-3 sm:max-w-[85%] sm:gap-1.5">
                {allCommittees.map((c) => (
                  <span
                    key={c.slug}
                    className="inline-flex max-w-full items-center gap-1 truncate rounded-full border border-white/15 bg-black/60 px-2 py-0.5 text-[9px] font-semibold text-white/90 shadow-sm backdrop-blur-md sm:px-2.5 sm:py-0.5 sm:text-[11px]"
                  >
                    <Users className="h-2.5 w-2.5 shrink-0 text-purple-300 sm:h-3 sm:w-3" />
                    <span className="truncate">{c.name}</span>
                  </span>
                ))}
              </div>
            );
          })()}
        </div>
        <div className="flex flex-1 flex-col p-3.5 sm:p-6">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-on-surface transition-colors group-hover:text-purple-300 sm:text-lg">
            {event.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 flex-1 text-[11px] leading-[1.45] text-on-surface-variant sm:mt-2 sm:text-sm sm:leading-relaxed">
            {event.description}
          </p>
          <div className="mt-3 space-y-1.5 text-[11px] leading-snug text-on-surface-variant sm:mt-4 sm:text-sm">
            <div className="flex items-start gap-1.5">
              <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400 sm:h-4 sm:w-4" strokeWidth={1.75} />
              <span className="line-clamp-2">
                {formatEventDate(event.date, event.dateText, event.endDate)}
                {event.time ? ` · ${event.time}` : ""}
              </span>
            </div>
            {event.venue && (
              <div className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400 sm:h-4 sm:w-4" strokeWidth={1.75} />
                <span className="line-clamp-1">{event.venue}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}

export function NotificationRow({
  notification,
}: {
  notification: {
    title: string;
    slug: string;
    description: string;
    date: Date;
    pdfUrl: string | null;
  };
}) {
  return (
    <Card interactive className="p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-900/30 text-purple-400">
          <FileText className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <time className="text-xs font-medium text-white/50">
            {formatDate(notification.date)}
          </time>
          <Link href={`/notifications/${notification.slug}`}>
            <h3 className="mt-1 line-clamp-2 text-base font-semibold text-on-surface transition-colors hover:text-purple-300">
              {notification.title}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">
            {notification.description}
          </p>
        </div>
        {notification.pdfUrl && (
          <a
            href={notification.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" /> PDF
          </a>
        )}
      </div>
    </Card>
  );
}
