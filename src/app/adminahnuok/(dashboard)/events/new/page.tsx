import { AdminHeader } from "@/components/admin/admin-ui";
import { EventForm } from "@/components/admin/event-form";
import { createEvent } from "@/lib/actions/events";

export default function NewEventPage() {
  return (
    <>
      <AdminHeader title="New event" description="Add an event to the union calendar." />
      <EventForm action={createEvent} />
    </>
  );
}

