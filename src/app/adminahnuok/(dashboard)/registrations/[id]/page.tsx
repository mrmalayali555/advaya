import { AdminHeader } from "@/components/admin/admin-ui";
import { Field, Select, Toggle, SubmitBtn, DeleteBtn, TextArea } from "@/components/admin/form-fields";
import { QRCodeDisplay } from "@/components/admin/qr-code";
import { updateRegistrationForm, deleteRegistrationForm, addRegistrationField, removeRegistrationField, reorderRegistrationFields } from "@/lib/actions/registration";
import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowUpIcon, ArrowDownIcon, TrashIcon, LinkIcon, UsersIcon } from "lucide-react";

export const metadata = {
  title: "Edit Registration Form | Admin",
};

export default async function EditRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const form = await db.registrationForm.findUnique({
    where: { id },
    include: {
      fields: { orderBy: { order: "asc" } },
      _count: { select: { submissions: true } },
    },
  });

  if (!form) notFound();

  const publicUrl = `https://advaya.college/registration/${form.slug}`;

  // Pre-calculate field IDs for reordering
  const fieldIds = form.fields.map(f => f.id);

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <Link
          href="/adminahnuok/registrations"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Forms
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AdminHeader title="Edit Form" description="Update details, manage fields, and view submissions." />
          <Link
            href={`/adminahnuok/registrations/${form.id}/submissions`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-ink-800 w-full sm:w-auto shrink-0 mb-8 sm:mb-0"
          >
            <UsersIcon className="h-4 w-4" />
            View Submissions ({form._count.submissions})
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Left Column: Form Details & Builder */}
        <div className="space-y-8">
          {/* Form Settings */}
          <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
            <h2 className="mb-6 text-lg font-bold text-ink-900 font-display">Form Settings</h2>
            <form action={updateRegistrationForm.bind(null, form.id)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Title" name="title" defaultValue={form.title} required />
                <Field label="Slug" name="slug" defaultValue={form.slug} required />
              </div>
              <TextArea
                label="Description"
                name="description"
                defaultValue={form.description || ""}
                placeholder="Optional description or instructions shown at the top of the form."
                rows={3}
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label="Deadline"
                  name="deadline"
                  type="datetime-local"
                  defaultValue={form.deadline ? new Date(new Date(form.deadline).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                />
                <div className="pt-8">
                  <Toggle label="Published" name="published" defaultChecked={form.published} />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-ink-100">
                <SubmitBtn>Save Settings</SubmitBtn>
              </div>
            </form>
            <div className="mt-4 flex justify-start">
              <form action={deleteRegistrationForm.bind(null, form.id)}>
                <DeleteBtn label="Delete Form" />
              </form>
            </div>
          </section>

          {/* Form Builder */}
          <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-900 font-display">Form Fields</h2>
            </div>
            
            <div className="space-y-4 mb-8">
              {form.fields.length === 0 ? (
                <div className="rounded-xl border border-dashed border-ink-200 p-8 text-center text-ink-500">
                  No fields yet. Add one below.
                </div>
              ) : (
                form.fields.map((field, idx) => (
                  <div key={field.id} className="flex items-center justify-between rounded-xl border border-ink-200 p-4 shadow-sm bg-ink-50/30">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ink-900">{field.label}</span>
                        {field.required && (
                          <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700">
                            Required
                          </span>
                        )}
                        <span className="rounded bg-ink-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-600">
                          {field.type}
                        </span>
                      </div>
                      {field.options && <p className="text-xs text-ink-500 mt-1">Options: {field.options}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1 mr-4">
                        {idx > 0 && (
                          <form action={async () => {
                            "use server";
                            const newOrder = [...fieldIds];
                            [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
                            await reorderRegistrationFields(form.id, newOrder);
                          }}>
                            <button className="text-ink-400 hover:text-ink-900"><ArrowUpIcon className="w-4 h-4" /></button>
                          </form>
                        )}
                        {idx < form.fields.length - 1 && (
                          <form action={async () => {
                            "use server";
                            const newOrder = [...fieldIds];
                            [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
                            await reorderRegistrationFields(form.id, newOrder);
                          }}>
                            <button className="text-ink-400 hover:text-ink-900"><ArrowDownIcon className="w-4 h-4" /></button>
                          </form>
                        )}
                      </div>
                      <form action={removeRegistrationField.bind(null, field.id)}>
                        <button className="p-2 text-ink-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-xl border border-ink-200 bg-ink-50/50 p-5">
              <h3 className="mb-4 text-sm font-bold text-ink-900">Add New Field</h3>
              <form action={addRegistrationField.bind(null, form.id)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Label" name="label" required placeholder="e.g., Phone Number" />
                  <Select
                    label="Field Type"
                    name="type"
                    options={[
                      { label: "Short Text", value: "text" },
                      { label: "Email", value: "email" },
                      { label: "Phone Number", value: "tel" },
                      { label: "Number", value: "number" },
                      { label: "Long Text (Textarea)", value: "textarea" },
                      { label: "File Upload", value: "file" },
                      { label: "Dropdown Select", value: "select" },
                      { label: "Checkbox", value: "checkbox" },
                      { label: "Radio Buttons", value: "radio" },
                      { label: "URL", value: "url" },
                      { label: "Date (Calendar)", value: "date" },
                      { label: "Time", value: "time" },
                      { label: "Color Picker", value: "color" },
                    ]}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Placeholder / Help Text"
                    name="placeholder"
                    placeholder="Optional hint..."
                  />
                  <Field
                    label="Options (for Select or Checkbox)"
                    name="options"
                    placeholder="Comma separated: Option 1, Option 2"
                    hint="Only used if type is Dropdown Select or Checkbox."
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Toggle label="Required Field" name="required" defaultChecked={true} />
                  <SubmitBtn>Add Field</SubmitBtn>
                </div>
              </form>
            </div>
          </section>
        </div>

        {/* Right Column: Sharing & QR */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
            <h3 className="mb-4 font-bold text-ink-900 font-display flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Share Link
            </h3>
            <div className="mb-6 rounded-lg bg-ink-50 p-3 text-sm font-mono text-ink-700 break-all border border-ink-100">
              {publicUrl}
            </div>
            <h4 className="mb-3 text-sm font-semibold text-ink-900">QR Code</h4>
            <QRCodeDisplay url={publicUrl} />
          </section>
        </div>
      </div>
    </div>
  );
}
