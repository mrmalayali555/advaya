"use client";

import { useState } from "react";
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
  committees?: { id: string }[];
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
  const [selectedCommittees, setSelectedCommittees] = useState<string[]>(() => {
    const ids = new Set<string>();
    if (event?.committeeId) ids.add(event.committeeId);
    if (event?.committees) {
      event.committees.forEach((c) => ids.add(c.id));
    }
    return Array.from(ids);
  });

  const toggleCommittee = (id: string) => {
    setSelectedCommittees((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
            </div>

            {/* Organizing Subcommittees / Clubs (Multi-select pills) */}
            <div className="rounded-xl border border-ink-100 bg-ink-50/40 p-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-1">
                Organizing Subcommittees / Clubs (optional)
              </label>
              <p className="text-xs text-ink-500 mb-3">
                Click one or more clubs if this event is organized by subcommittees (can select multiple for collaborations).
              </p>
              {committees.length === 0 ? (
                <p className="text-xs text-ink-400 italic">No subcommittees added yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {committees.map((c) => {
                    const isSelected = selectedCommittees.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleCommittee(c.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          isSelected
                            ? "bg-purple-600 text-white border-purple-600 shadow-sm scale-[1.02]"
                            : "bg-white text-ink-700 border-ink-200 hover:border-purple-300 hover:bg-purple-50/40"
                        }`}
                      >
                        <span>{c.name}</span>
                        {isSelected ? (
                          <span className="text-white font-bold ml-0.5">✓</span>
                        ) : (
                          <span className="text-ink-400 font-bold ml-0.5">+</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              <input
                type="hidden"
                name="committeeIds"
                value={JSON.stringify(selectedCommittees)}
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

