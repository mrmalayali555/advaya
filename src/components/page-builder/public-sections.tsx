import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import {
  FileText,
  Download,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  Shield,
  Calendar
} from "lucide-react";
import type {
  RichTextData,
  ButtonData,
  NoticeBoardData,
  FileDownloadsData,
  FaqData,
  PeopleData,
  StatsData,
  LinksData,
  VideoData,
  QuoteData,
  DividerData,
  ScheduleData,
  CountdownData,
  ContactData,
  TimelineData,
  DutyRosterData,
  GalleryData,
  QuickActionsData,
  AnnouncementData
} from "@/lib/page-builder-types";
import {
  FaqIsland,
  CountdownIsland,
  GalleryIsland,
  AnnouncementIsland,
  StatsIsland,
} from "./client-islands";

// ──────────────────────────────────────────────────────────────────────────────
// 1. RichTextSection
// ──────────────────────────────────────────────────────────────────────────────
export function RichTextSection({ data }: { data: RichTextData }) {
  if (!data.html) return null;
  return (
    <div
      className="prose prose-invert prose-purple max-w-none prose-headings:font-display prose-a:text-purple-400 hover:prose-a:text-purple-300"
      dangerouslySetInnerHTML={{ __html: data.html }}
    />
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 2. ButtonSection
// ──────────────────────────────────────────────────────────────────────────────
export function ButtonSection({ data }: { data: ButtonData }) {
  if (!data.buttons || data.buttons.length === 0) return null;

  const alignClass = 
    data.alignment === "center" ? "justify-center" : 
    data.alignment === "right" ? "justify-end" : "justify-start";

  return (
    <div className={cn("flex flex-wrap gap-4", alignClass)}>
      {data.buttons.map((btn) => {
        const isPrimary = btn.style === "primary";
        const isSecondary = btn.style === "secondary";
        const isOutline = btn.style === "outline";
        const isGhost = btn.style === "ghost";

        return (
          <a
            key={btn.id}
            href={btn.url}
            target={btn.openInNewTab || btn.url.startsWith("http") ? "_blank" : undefined}
            rel={btn.openInNewTab || btn.url.startsWith("http") ? "noopener noreferrer" : undefined}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all",
              isPrimary && "bg-purple-600 text-white hover:bg-purple-700 shadow-[0_4px_14px_0_rgba(120,0,255,0.39)] hover:shadow-[0_6px_20px_rgba(120,0,255,0.23)]",
              isSecondary && "bg-white/10 text-white hover:bg-white/20",
              isOutline && "border border-purple-500/30 text-purple-300 hover:bg-purple-500/10",
              isGhost && "text-purple-300 hover:bg-purple-900/30 hover:text-purple-200"
            )}
          >
            {btn.label}
          </a>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 3. NoticeBoardSection
// ──────────────────────────────────────────────────────────────────────────────
export function NoticeBoardSection({ data }: { data: NoticeBoardData }) {
  if (!data.notices || data.notices.length === 0) return null;

  const now = new Date().getTime();
  const activeNotices = data.notices.filter((n) => {
    if (!n.expiryDate) return true;
    return new Date(n.expiryDate).getTime() > now;
  });

  if (activeNotices.length === 0) return null;

  return (
    <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {activeNotices.map((notice) => {
        const priorityColors = {
          urgent: "bg-red-500/10 text-red-400 border-red-500/20",
          new: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          pinned: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };

        return (
          <RevealItem key={notice.id} as="article">
            <Card className="glass-card flex h-full flex-col p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize", priorityColors[notice.priority])}>
                  {notice.priority}
                </span>
                <span className="text-xs font-medium text-on-surface-variant">
                  {new Date(notice.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <h3 className="mb-2 font-bold text-on-surface">{notice.title}</h3>
              <p className="mb-4 flex-1 text-sm text-on-surface-variant line-clamp-3">
                {notice.body}
              </p>
              {notice.attachmentUrl && (
                <a
                  href={notice.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-purple-300 transition-colors hover:bg-white/10 hover:text-purple-200"
                >
                  <Download className="h-4 w-4" />
                  {notice.attachmentName || "Download Attachment"}
                </a>
              )}
            </Card>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 4. FileDownloadsSection
// ──────────────────────────────────────────────────────────────────────────────
export function FileDownloadsSection({ data }: { data: FileDownloadsData }) {
  if (!data.files || data.files.length === 0) return null;

  // Group by category
  const grouped = data.files.reduce((acc, file) => {
    const cat = file.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(file);
    return acc;
  }, {} as Record<string, typeof data.files>);

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, files]) => (
        <div key={category}>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-on-surface-variant">
            {category}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {files.map((file) => (
              <a
                key={file.id}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-white/5 bg-surface-container-low p-4 transition-all hover:bg-surface-container hover:border-purple-500/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-on-surface group-hover:text-purple-300">
                    {file.name}
                  </div>
                  {(file.description || file.size) && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-on-surface-variant">
                      {file.size && <span>{file.size}</span>}
                      {file.size && file.description && <span>•</span>}
                      {file.description && <span className="truncate">{file.description}</span>}
                    </div>
                  )}
                </div>
                <Download className="h-4 w-4 shrink-0 text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 5. FaqSection
// ──────────────────────────────────────────────────────────────────────────────
export function FaqSection({ data }: { data: FaqData }) {
  if (!data.items || data.items.length === 0) return null;
  return <FaqIsland items={data.items} />;
}

// ──────────────────────────────────────────────────────────────────────────────
// 6. PeopleSection
// ──────────────────────────────────────────────────────────────────────────────
export function PeopleSection({ data }: { data: PeopleData }) {
  if (!data.people || data.people.length === 0) return null;

  const isList = data.layout === "list";
  const gridClass = isList
    ? "grid gap-4 sm:grid-cols-2"
    : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <RevealGroup className={gridClass}>
      {data.people.map((person) => (
        <RevealItem key={person.id} as="article">
          <Card className="glass-card flex flex-col items-center p-6 text-center">
            {person.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={person.photoUrl}
                alt={person.name}
                className="mb-4 h-24 w-24 rounded-full object-cover ring-2 ring-purple-500/20"
              />
            ) : (
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-purple-900/40 text-2xl font-bold text-purple-300 ring-2 ring-purple-500/20">
                {person.name.charAt(0)}
              </div>
            )}
            <h3 className="font-bold text-on-surface">{person.name}</h3>
            <p className="text-sm font-medium text-purple-400">{person.role}</p>
            {person.group && (
              <span className="mt-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-on-surface-variant">
                {person.group}
              </span>
            )}
            <div className="mt-4 flex w-full flex-col gap-2 border-t border-white/5 pt-4">
              {person.phone && (
                <a
                  href={`tel:${person.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-high px-3 py-2 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-white"
                >
                  <Phone className="h-3 w-3" />
                  {person.phone}
                </a>
              )}
              {person.email && (
                <a
                  href={`mailto:${person.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-high px-3 py-2 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-white truncate"
                >
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate">{person.email}</span>
                </a>
              )}
            </div>
          </Card>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 7. StatsSection
// ──────────────────────────────────────────────────────────────────────────────
export function StatsSection({ data }: { data: StatsData }) {
  if (!data.items || data.items.length === 0) return null;
  return <StatsIsland items={data.items} />;
}

// ──────────────────────────────────────────────────────────────────────────────
// 8. LinksSection
// ──────────────────────────────────────────────────────────────────────────────
export function LinksSection({ data }: { data: LinksData }) {
  if (!data.links || data.links.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col justify-between rounded-2xl border border-white/5 bg-surface-container p-6 transition-all hover:-translate-y-1 hover:border-purple-500/30 hover:bg-surface-container-high hover:shadow-xl hover:shadow-purple-900/20"
        >
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <ExternalLink className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-on-surface group-hover:text-purple-300 transition-colors">
              {link.title}
            </h3>
            {link.description && (
              <p className="mt-2 text-sm text-on-surface-variant line-clamp-2">
                {link.description}
              </p>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
            Visit link <ArrowRight className="h-3 w-3" />
          </div>
        </a>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 9. VideoSection
// ──────────────────────────────────────────────────────────────────────────────
export function VideoSection({ data }: { data: VideoData }) {
  if (!data.url) return null;

  // Simple parser to make standard URLs into embed URLs
  let embedUrl = data.url;
  if (data.url.includes("youtube.com/watch?v=")) {
    embedUrl = data.url.replace("watch?v=", "embed/");
  } else if (data.url.includes("youtu.be/")) {
    embedUrl = data.url.replace("youtu.be/", "youtube.com/embed/");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-surface-container-highest shadow-2xl">
        <iframe
          src={embedUrl}
          title={data.title || "Video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      {(data.title || data.description) && (
        <div className="mt-6 text-center">
          {data.title && <h3 className="text-xl font-bold text-on-surface">{data.title}</h3>}
          {data.description && <p className="mt-2 text-on-surface-variant">{data.description}</p>}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 10. QuoteSection
// ──────────────────────────────────────────────────────────────────────────────
export function QuoteSection({ data }: { data: QuoteData }) {
  if (!data.text) return null;

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="glass-card flex flex-col items-center p-8 text-center sm:p-12">
        <div className="mb-6 font-serif text-6xl text-purple-500/40">&quot;</div>
        <blockquote className="text-xl font-medium leading-relaxed sm:text-2xl md:text-3xl lg:leading-snug text-on-surface">
          {data.text}
        </blockquote>
        <div className="mt-8 flex flex-col items-center">
          <cite className="font-bold not-italic text-purple-300">{data.author}</cite>
          {data.role && (
            <span className="text-sm font-medium text-on-surface-variant">{data.role}</span>
          )}
        </div>
      </Card>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 11. DividerSection
// ──────────────────────────────────────────────────────────────────────────────
export function DividerSection({ data }: { data: DividerData }) {
  if (data.style === "space") {
    return <div className="py-8 sm:py-12" />;
  }

  if (data.style === "dotted") {
    return (
      <div className="flex w-full items-center justify-center py-8">
        <div className="w-full border-t-[2px] border-dotted border-white/20" />
      </div>
    );
  }

  if (data.style === "gradient") {
    return (
      <div className="flex w-full items-center justify-center py-8">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center py-8">
      <div className="h-[1px] w-full bg-white/10" />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 12. ScheduleSection
// ──────────────────────────────────────────────────────────────────────────────
export function ScheduleSection({ data }: { data: ScheduleData }) {
  if (!data.days || data.days.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface-container glass-card">
        <div className="min-w-[600px]">
          {data.days.map((day, i) => (
            <div key={i} className="flex border-b border-white/5 last:border-0">
              <div className="flex w-32 shrink-0 items-center justify-center bg-surface-container-high p-4 font-bold text-purple-300">
                {day.day}
              </div>
              <div className="flex flex-1 divide-x divide-white/5">
                {day.slots.map((slot, j) => (
                  <div key={j} className="flex flex-1 flex-col p-4">
                    <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      {slot.time}
                    </span>
                    <span className="text-sm font-medium text-on-surface">{slot.content}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {data.caption && (
        <p className="text-center text-sm text-on-surface-variant">{data.caption}</p>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 13. CountdownSection
// ──────────────────────────────────────────────────────────────────────────────
export function CountdownSection({ data }: { data: CountdownData }) {
  if (!data.targetDate) return null;
  return <CountdownIsland data={data} />;
}

// ──────────────────────────────────────────────────────────────────────────────
// 14. ContactSection
// ──────────────────────────────────────────────────────────────────────────────
export function ContactSection({ data }: { data: ContactData }) {
  return (
    <Card className="glass-card p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.phone && (
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
              <Phone className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Phone</h4>
            <a href={`tel:${data.phone.replace(/\s+/g, "")}`} className="mt-1 font-semibold text-on-surface hover:text-purple-300">
              {data.phone}
            </a>
          </div>
        )}
        {data.email && (
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
              <Mail className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email</h4>
            <a href={`mailto:${data.email}`} className="mt-1 font-semibold text-on-surface hover:text-purple-300 truncate w-full">
              {data.email}
            </a>
          </div>
        )}
        {data.location && (
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
              <MapPin className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Location</h4>
            <span className="mt-1 font-semibold text-on-surface">{data.location}</span>
          </div>
        )}
        {data.hours && (
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
              <Clock className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Hours</h4>
            <span className="mt-1 font-semibold text-on-surface">{data.hours}</span>
          </div>
        )}
      </div>
      {data.whatsapp && (
        <div className="mt-8 flex justify-center border-t border-white/5 pt-8">
          <a
            href={data.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg hover:bg-emerald-700"
          >
            <MessageCircle className="h-5 w-5" />
            Chat on WhatsApp
          </a>
        </div>
      )}
    </Card>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 15. TimelineSection
// ──────────────────────────────────────────────────────────────────────────────
export function TimelineSection({ data }: { data: TimelineData }) {
  if (!data.items || data.items.length === 0) return null;

  return (
    <div className="relative mx-auto max-w-3xl before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-purple-500/30 before:to-transparent">
      {data.items.map((item, i) => {
        return (
          <Reveal key={item.id} delay={i * 0.1}>
            <div className={cn("relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group", "mb-8 last:mb-0")}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-surface bg-purple-500/20 text-purple-400 shadow-[0_0_0_4px_var(--color-surface)] md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mx-auto ml-0 md:ml-auto group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card rounded-2xl p-5 sm:p-6 transition-all group-hover:border-purple-500/30">
                <div className="mb-2 text-sm font-bold text-purple-400">{item.date}</div>
                <h3 className="mb-2 text-lg font-bold text-on-surface">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-on-surface-variant">{item.description}</p>
                )}
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 16. DutyRosterSection
// ──────────────────────────────────────────────────────────────────────────────
export function DutyRosterSection({ data }: { data: DutyRosterData }) {
  if (!data.days || data.days.length === 0) return null;

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-surface-container-high/40 p-5 sm:p-8 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-on-surface">Duty Roster</h3>
          <p className="text-sm text-on-surface-variant">Shift schedule & contacts</p>
        </div>
      </div>
      
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
        {data.days.map((item) => (
          <div key={item.day} className="rounded-xl border border-white/10 bg-surface-container-high/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {item.day}
              </span>
              <Clock className="h-4 w-4 text-ink-400" />
            </div>
            <div className="space-y-3 text-sm">
              {item.shifts.map((shift, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 w-fit px-2 py-0.5 rounded-md">{shift.time}</span>
                  <span className="text-on-surface font-medium leading-snug">{shift.names}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {data.contacts && data.contacts.length > 0 && (
        <div className="pt-6 border-t border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
            Contact Directory
          </h4>
          <div className="flex flex-wrap gap-3">
            {data.contacts.map((contact, idx) => (
              <div key={idx} className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2">
                <span className="text-sm font-medium text-on-surface">{contact.name}</span>
                {contact.phone && (
                  <>
                    <span className="text-indigo-500/40">|</span>
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                      className="text-sm font-mono font-semibold text-indigo-300 hover:text-indigo-200 hover:underline flex items-center gap-1.5"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {contact.phone}
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 17. GallerySection
// ──────────────────────────────────────────────────────────────────────────────
export function GallerySection({ data }: { data: GalleryData }) {
  if (!data.images || data.images.length === 0) return null;
  return <GalleryIsland data={data} />;
}

// ──────────────────────────────────────────────────────────────────────────────
// 18. QuickActionsSection
// ──────────────────────────────────────────────────────────────────────────────
export function QuickActionsSection({ data }: { data: QuickActionsData }) {
  if (!data.actions || data.actions.length === 0) return null;

  return (
    <div className="-mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 pb-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 sm:pb-0 scrollbar-none">
      <div className="flex gap-4 sm:flex-wrap">
        {data.actions.map((action) => (
          <a
            key={action.id}
            href={action.url}
            className="group flex w-24 shrink-0 snap-start flex-col items-center gap-3 sm:w-auto"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-surface-container shadow-lg transition-all group-hover:-translate-y-1 group-hover:border-purple-500/40 group-hover:bg-purple-900/30 group-hover:shadow-purple-900/20">
              <span className="text-2xl text-purple-400 group-hover:text-purple-300">
                {/* Normally we'd map action.icon string to an actual icon component, but since it's dynamic and lucide doesn't support easy dynamic imports in server components, we'll use a generic icon or rely on emoji/text if it's text. Let's use a generic ExternalLink for now as a fallback since icon mapping requires a big switch. */}
                <ExternalLink className="h-6 w-6" />
              </span>
            </div>
            <span className="text-center text-xs font-semibold text-on-surface-variant group-hover:text-on-surface sm:text-sm">
              {action.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 19. AnnouncementSection
// ──────────────────────────────────────────────────────────────────────────────
export function AnnouncementSection({ data }: { data: AnnouncementData }) {
  if (!data.text) return null;
  return <AnnouncementIsland data={data} />;
}
