import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, MapPin, FileText, Download, Users } from "lucide-react";
import { Badge, Card } from "@/components/ui/primitives";
import { formatDate, formatDateRange } from "@/lib/utils";

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
    <Card interactive className="flex h-full flex-col">
      <Link href={`/achievements/${achievement.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          <CoverImage src={achievement.coverImage} alt={achievement.title} />
          <div className="absolute left-4 top-4">
            <Badge tone={achTone[achievement.category] ?? "purple"}>
              {achievement.category}
            </Badge>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <time className="text-xs font-medium text-white/50">
            {formatDate(achievement.date)}
          </time>
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-on-surface transition-colors group-hover:text-purple-300">
            {achievement.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-on-surface-variant">
            {achievement.description}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-purple-400">
            Read more
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
    date: Date;
    endDate: Date | null;
    time: string | null;
    venue: string | null;
    poster: string | null;
    status: string;
    committee?: { name: string; slug: string } | null;
  };
}) {
  return (
    <Card interactive className="flex h-full flex-col">
      <Link href={`/events/${event.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          <CoverImage src={event.poster} alt={event.title} />
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-1.5">
            <Badge tone={statusTone[event.status] ?? "info"}>{event.status}</Badge>
          </div>
          {event.committee && (
            <div className="absolute right-3 bottom-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/90 shadow-sm">
                <Users className="h-3 w-3 text-purple-300" />
                {event.committee.name}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="line-clamp-2 text-lg font-semibold text-on-surface transition-colors group-hover:text-purple-300">
            {event.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-on-surface-variant">
            {event.description}
          </p>
          <div className="mt-4 space-y-1.5 text-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-purple-400" strokeWidth={1.75} />
              {formatDateRange(event.date, event.endDate)}
              {event.time ? ` · ${event.time}` : ""}
            </div>
            {event.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-400" strokeWidth={1.75} />
                {event.venue}
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
