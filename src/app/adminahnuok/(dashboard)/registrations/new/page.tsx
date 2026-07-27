import { AdminHeader } from "@/components/admin/admin-ui";
import { Field, Select, SubmitBtn } from "@/components/admin/form-fields";
import { createRegistrationForm } from "@/lib/actions/registration";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export const metadata = {
  title: "New Registration Form | Admin",
};

export default async function NewRegistrationPage() {
  // Fetch events that might need a form
  const events = await db.event.findMany({
    where: { registrationForm: null },
    orderBy: { date: "desc" },
    select: { id: true, title: true, date: true },
  });

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link
          href="/adminahnuok/registrations"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Forms
        </Link>
        <AdminHeader title="Create Registration Form" description="Set up a new form for an event or standalone use." />
      </div>

      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft sm:p-8">
        <form action={createRegistrationForm} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Form Title"
              name="title"
              required
              placeholder="e.g., Chess Tournament Registration"
              hint="The public title of the form."
            />
            <Field
              label="URL Slug"
              name="slug"
              required
              placeholder="e.g., chess-tournament-2026"
              hint="The URL path: advaya.college/registration/[slug]"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Select
              label="Link to Event (Optional)"
              name="eventId"
              options={[
                { label: "None (Standalone Form)", value: "" },
                ...events.map(e => ({
                  label: `${e.title} (${new Date(e.date).toLocaleDateString()})`,
                  value: e.id,
                })),
              ]}
              hint="If linked, a 'Register Now' button will appear on the event page."
            />
            <Field
              label="Deadline (Optional)"
              name="deadline"
              type="datetime-local"
              hint="After this time, submissions will be closed."
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-ink-100">
            <SubmitBtn>Create Form &amp; Continue to Builder</SubmitBtn>
          </div>
        </form>
      </div>
    </div>
  );
}
