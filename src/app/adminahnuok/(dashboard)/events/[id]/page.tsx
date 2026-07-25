import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-ui";
import { EventForm } from "@/components/admin/event-form";
import { db } from "@/lib/db";
import { updateEvent, deleteEvent } from "@/lib/actions/events";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await db.event.findUnique({ where: { id } });
  if (!event) notFound();

  const update = updateEvent.bind(null, id);
  const remove = deleteEvent.bind(null, id);

  return (
    <>
      <AdminHeader title="Edit event" description={event.title} />
      <EventForm event={event} action={update} deleteAction={remove} />
    </>
  );
}
