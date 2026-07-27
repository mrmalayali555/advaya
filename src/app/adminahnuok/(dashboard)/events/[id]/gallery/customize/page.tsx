import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { notFound, redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-ui";
import { GalleryEditor } from "@/components/admin/gallery-editor";

export default async function GalleryCustomizePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const event = await db.event.findUnique({
    where: { id },
    include: {
      gallery: {
        include: {
          photos: {
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });

  if (!event) notFound();

  if (!event.gallery) {
    redirect(`/adminahnuok/events/${event.id}/gallery`);
  }

  const galleryData = {
    ...event.gallery,
    eventId: event.id,
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Customize Gallery: ${event.title}`}
        description={`Editing ${event.gallery.theme} theme gallery. Upload photos and edit text below.`}
      />

      <GalleryEditor gallery={galleryData} />
    </div>
  );
}
