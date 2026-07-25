import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/admin-ui";
import { Field, TextArea, UploadField, Toggle, SubmitBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { updateIntervention } from "@/lib/actions/interventions";

export default async function EditInterventionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await db.intervention.findUnique({ where: { id } });

  if (!item) {
    notFound();
  }

  const dateStr = new Date(item.date).toISOString().split("T")[0];

  return (
    <>
      <Link
        href="/admin/interventions"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-purple-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to interventions
      </Link>

      <AdminHeader
        title="Edit Intervention"
        description={`Update ${item.title}`}
      />

      <AdminCard className="max-w-3xl">
        <form action={updateIntervention.bind(null, id)} className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Title"
              name="title"
              defaultValue={item.title}
              required
              placeholder="Representation regarding hostel maintenance & security"
            />
          </div>

          <div className="sm:col-span-2">
            <TextArea
              label="Description / Summary"
              name="description"
              defaultValue={item.description}
              required
              rows={6}
              placeholder="Enter full details of the representation or official communication..."
            />
          </div>

          <Field
            label="Date"
            name="date"
            type="date"
            defaultValue={dateStr}
            required
          />

          <Field
            label="Category (Optional)"
            name="category"
            defaultValue={item.category || ""}
            placeholder="Academic / Infrastructure / Hostel / General"
          />

          <div className="sm:col-span-2">
            <UploadField
              label="PDF Document Attachment (Optional)"
              name="pdfUrl"
              defaultUrl={item.pdfUrl}
              accept=".pdf,application/pdf"
              hint="Upload signed PDF letter or official response"
            />
          </div>

          <div className="sm:col-span-2">
            <UploadField
              label="Cover Image (Optional)"
              name="image"
              defaultUrl={item.image}
              accept="image/*"
              enableCrop={false}
              hint="Upload header photo or event image"
            />
          </div>

          <Toggle
            label="Published"
            name="published"
            defaultChecked={item.published}
            hint="Turn off to save as draft"
          />

          <Toggle
            label="Pin to top"
            name="pinned"
            defaultChecked={item.pinned}
            hint="Show at top of interventions list"
          />

          <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-ink-100">
            <Link
              href="/admin/interventions"
              className="rounded-full border border-ink-200 px-6 py-2.5 text-sm font-semibold text-ink-600 hover:bg-ink-50"
            >
              Cancel
            </Link>
            <SubmitBtn>Save changes</SubmitBtn>
          </div>
        </form>
      </AdminCard>
    </>
  );
}
