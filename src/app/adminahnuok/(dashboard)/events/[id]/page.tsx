import { notFound } from "next/navigation";
import Link from "next/link";
import { Camera, Pencil, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import { EventForm } from "@/components/admin/event-form";
import { db } from "@/lib/db";
import { updateEvent, deleteEvent } from "@/lib/actions/events";
import { deleteGallery } from "@/lib/actions/gallery";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await db.event.findUnique({ where: { id } });
  if (!event) notFound();

  const gallery = await db.eventGallery.findUnique({ where: { eventId: id } });

  const update = updateEvent.bind(null, id);
  const remove = deleteEvent.bind(null, id);

  return (
    <>
      <AdminHeader title="Edit event" description={event.title} />
      <EventForm event={event} action={update} deleteAction={remove} />

      {/* ── Photo Gallery Section ── */}
      <div className="mt-10 rounded-2xl border border-ink-100 bg-white p-6 shadow-[var(--shadow-soft)]">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-ink-800">
          <Camera className="h-5 w-5 text-purple-500" />
          Photo Gallery
        </h3>

        {gallery ? (
          <div className="mt-4">
            <p className="text-sm text-ink-500">
              This event has a <strong className="text-purple-600">{gallery.theme}</strong> theme gallery.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/adminahnuok/events/${id}/gallery/customize`}
                className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(91,42,134,0.39)] transition-all hover:-translate-y-0.5 hover:bg-purple-700"
              >
                <Pencil className="h-4 w-4" />
                Edit Gallery
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteGallery(gallery.id);
                }}
              >
                <button
                  type="submit"
                  onClick={() => {}}
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Gallery
                </button>
              </form>
            </div>
          </div>
        ) : event.status === "completed" ? (
          <div className="mt-4">
            <p className="text-sm text-ink-500">
              Add a photo gallery to showcase memories from this completed event.
            </p>
            <Link
              href={`/adminahnuok/events/${id}/gallery`}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(91,42,134,0.39)] transition-all hover:-translate-y-0.5 hover:bg-purple-700"
            >
              <Camera className="h-4 w-4" />
              Add Photo Gallery
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink-400">
            Photo gallery can be added once the event status is set to &quot;completed&quot;.
          </p>
        )}
      </div>
    </>
  );
}
