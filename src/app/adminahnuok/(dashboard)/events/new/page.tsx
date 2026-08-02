import { AdminHeader } from "@/components/admin/admin-ui";
import { EventForm } from "@/components/admin/event-form";
import { createEvent } from "@/lib/actions/events";
import { getCommitteesList } from "@/lib/queries";

export default async function NewEventPage() {
  const committees = await getCommitteesList();

  return (
    <>
      <AdminHeader title="New event" description="Add an event to the union calendar." />
      <EventForm action={createEvent} committees={committees} />
    </>
  );
}
