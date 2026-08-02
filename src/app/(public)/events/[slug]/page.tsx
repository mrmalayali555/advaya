import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, Paperclip, Download, UserPlus, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Badge } from "@/components/ui/primitives";
import { MediaGallery } from "@/components/cards/media-gallery";
import { EventGalleryRenderer } from "@/components/gallery/gallery-themes";
import { getEvent } from "@/lib/queries";
import { formatDateRange, formatDateTime } from "@/lib/utils";

const statusTone: Record<string, "info" | "success" | "danger"> = {
  upcoming: "info",
  completed: "success",
  cancelled: "danger",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) return { title: "Event not found" };
  return { title: e.title, description: e.description.slice(0, 160) };
}

export default async function EventDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Event"
        title={e.title}
        breadcrumb={[{ label: "Events", href: "/events" }, { label: e.title }]}
      />
      <section className="py-14 sm:py-20">
        <Container size="narrow">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone={statusTone[e.status] ?? "info"}>{e.status}</Badge>
            {e.committee && (
              <Link
                href={`/subcommittee/${e.committee.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-purple-900/30 border border-purple-500/20 px-3.5 py-1 text-xs font-semibold text-purple-300 hover:bg-purple-900/50 transition-colors"
              >
                <Users className="h-3.5 w-3.5" />
                {e.committee.name}
              </Link>
            )}
          </div>

          {e.poster && (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl border border-ink-100">
              <Image
                src={e.poster}
                alt={e.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {e.registrationForm && e.registrationForm.published && (!e.registrationForm.deadline || new Date() <= new Date(e.registrationForm.deadline)) && (
            <div className="mt-8 rounded-2xl bg-purple-500/10 p-6 border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-bold text-purple-100 text-lg">Registration Open</h3>
                <p className="text-purple-200/70 text-sm mt-1">
                  {e.registrationForm.deadline ? `Closes on ${formatDateTime(e.registrationForm.deadline)}` : "Register now to secure your spot"}
                </p>
              </div>
              <a 
                href={`/registration/${e.registrationForm.slug}`} 
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-purple-500 shrink-0"
              >
                <UserPlus className="h-4 w-4" />
                Register Now
              </a>
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <MetaTile
              icon={<CalendarDays className="h-5 w-5" />}
              label={e.endDate ? "Dates" : "Date"}
              value={formatDateRange(e.date, e.endDate)}
            />
            {e.time && <MetaTile icon={<Clock className="h-5 w-5" />} label="Time" value={e.time} />}
            {e.venue && <MetaTile icon={<MapPin className="h-5 w-5" />} label="Venue" value={e.venue} />}
          </div>

          <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-on-surface-variant">
            {e.description}
          </div>

          {e.attachments.length > 0 && (
            <div className="mt-8 space-y-2">
              {e.attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl glass-card px-5 py-4 transition-colors hover:border-purple-500/30"
                >
                  <span className="flex items-center gap-3 text-sm font-medium text-on-surface">
                    <Paperclip className="h-4 w-4 text-purple-400" />
                    {att.name}
                  </span>
                  <Download className="h-4 w-4 text-on-surface-variant" />
                </a>
              ))}
            </div>
          )}

          {e.media.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-on-surface">Gallery</h2>
              <MediaGallery media={e.media} />
            </div>
          )}

          {e.gallery && e.gallery.photos.length > 0 && (
            <EventGalleryRenderer gallery={e.gallery} />
          )}
        </Container>
      </section>
    </>
  );
}

function MetaTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl glass-card px-4 py-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-on-surface-variant">{label}</div>
        <div className="truncate text-sm font-semibold text-on-surface">{value}</div>
      </div>
    </div>
  );
}
