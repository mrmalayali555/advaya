import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarDays, Clock, MapPin, Paperclip, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Badge } from "@/components/ui/primitives";
import { MediaGallery } from "@/components/cards/media-gallery";
import { EventGalleryRenderer } from "@/components/gallery/gallery-themes";
import { getEvent } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

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
          <Badge tone={statusTone[e.status] ?? "info"}>{e.status}</Badge>

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

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <MetaTile icon={<CalendarDays className="h-5 w-5" />} label="Date" value={formatDate(e.date)} />
            {e.time && <MetaTile icon={<Clock className="h-5 w-5" />} label="Time" value={e.time} />}
            {e.venue && <MetaTile icon={<MapPin className="h-5 w-5" />} label="Venue" value={e.venue} />}
          </div>

          <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-ink-600">
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
                  className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white px-5 py-4 transition-colors hover:border-purple-200"
                >
                  <span className="flex items-center gap-3 text-sm font-medium text-ink-700">
                    <Paperclip className="h-4 w-4 text-purple-500" />
                    {att.name}
                  </span>
                  <Download className="h-4 w-4 text-ink-400" />
                </a>
              ))}
            </div>
          )}

          {e.media.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-ink-900">Gallery</h2>
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
    <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-surface px-4 py-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-ink-400">{label}</div>
        <div className="truncate text-sm font-semibold text-ink-800">{value}</div>
      </div>
    </div>
  );
}
