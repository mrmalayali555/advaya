"use client";

import Link from "next/link";
import { Field, TextArea, Select, Toggle, UploadField, SubmitBtn, DeleteBtn } from "./form-fields";

type EventData = {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate: Date | null;
  time: string | null;
  venue: string | null;
  poster: string | null;
  status: string;
  published: boolean;
  committeeId: string | null;
};

function toDateInput(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export function EventForm({
  event,
  action,
  deleteAction,
  committees = [],
}: {
  event?: EventData;
  action: (formData: FormData) => void;
  deleteAction?: (formData: FormData) => void;
  committees?: { id: string; name: string }[];
}) {
  return (
    <div className="space-y-6">
      <form action={action} className="space-y-6">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="grid gap-5">
            <Field label="Title" name="title" defaultValue={event?.title} required placeholder="ADVAYA Union Day 2026" />
            <TextArea label="Description" name="description" defaultValue={event?.description} required rows={5} placeholder="What's this event about?" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Start Date" name="date" type="date" defaultValue={event ? toDateInput(event.date) : ""} required />
              <Field
                label="End Date (optional)"
                name="endDate"
                type="date"
                defaultValue={event?.endDate ? toDateInput(event.endDate) : ""}
                hint="Leave blank for single-day events"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Time" name="time" defaultValue={event?.time ?? ""} placeholder="5:00 PM" />
              <Field label="Venue" name="venue" defaultValue={event?.venue ?? ""} placeholder="Main Auditorium" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                label="Status"
                name="status"
                defaultValue={event?.status ?? "upcoming"}
                options={[
                  { value: "upcoming", label: "Upcoming" },
                  { value: "completed", label: "Completed" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />
              <Select
                label="Subcommittee (optional)"
                name="committeeId"
                defaultValue={event?.committeeId ?? ""}
                options={[
                  { value: "", label: "— None —" },
                  ...committees.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            </div>
            <UploadField label="Poster" name="poster" defaultUrl={event?.poster} accept="image/*" hint="JPG, PNG, WebP up to 8MB" />
            <Toggle label="Published" name="published" defaultChecked={event?.published ?? true} hint="Show on the public site" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SubmitBtn>{event ? "Save changes" : "Create event"}</SubmitBtn>
          <Link href="/adminahnuok/events" className="text-sm font-medium text-ink-500 hover:text-ink-800">
            Cancel
          </Link>
        </div>
      </form>

      {event && deleteAction && (
        <form action={deleteAction} className="border-t border-ink-100 pt-6">
          <DeleteBtn label="Delete event" />
        </form>
      )}
    </div>
  );
}

