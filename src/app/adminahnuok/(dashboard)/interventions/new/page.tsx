import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/admin-ui";
import { Field, TextArea, UploadField, Toggle, SubmitBtn } from "@/components/admin/form-fields";
import { createIntervention } from "@/lib/actions/interventions";

export default function NewInterventionPage() {
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <>
      <Link
        href="/admin/interventions"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-purple-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to interventions
      </Link>

      <AdminHeader
        title="Add Intervention"
        description="Publish an official letter, representation, or request."
      />

      <AdminCard className="max-w-3xl">
        <form action={createIntervention} className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Title"
              name="title"
              required
              placeholder="Representation regarding hostel maintenance & security"
            />
          </div>

          <div className="sm:col-span-2">
            <TextArea
              label="Description / Summary"
              name="description"
              required
              rows={6}
              placeholder="Enter full details of the representation or official communication..."
            />
          </div>

          <Field
            label="Date"
            name="date"
            type="date"
            defaultValue={todayStr}
            required
          />

          <Field
            label="Category (Optional)"
            name="category"
            placeholder="Academic / Infrastructure / Hostel / General"
          />

          <div className="sm:col-span-2">
            <UploadField
              label="PDF Document Attachment (Optional)"
              name="pdfUrl"
              accept=".pdf,application/pdf"
              hint="Upload signed PDF letter or official response"
            />
          </div>

          <div className="sm:col-span-2">
            <UploadField
              label="Cover Image (Optional)"
              name="image"
              accept="image/*"
              enableCrop={false}
              hint="Upload header photo or event image"
            />
          </div>

          <Toggle
            label="Publish immediately"
            name="published"
            defaultChecked={true}
            hint="If off, saves as draft"
          />

          <Toggle
            label="Pin to top"
            name="pinned"
            defaultChecked={false}
            hint="Show at top of interventions list"
          />

          <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-ink-100">
            <Link
              href="/admin/interventions"
              className="rounded-full border border-ink-200 px-6 py-2.5 text-sm font-semibold text-ink-600 hover:bg-ink-50"
            >
              Cancel
            </Link>
            <SubmitBtn>Save intervention</SubmitBtn>
          </div>
        </form>
      </AdminCard>
    </>
  );
}
