import { AdminHeader, AdminCard } from "@/components/admin/admin-ui";
import { Field, Toggle, SubmitBtn } from "@/components/admin/form-fields";
import { AdminEmergencyManager } from "@/components/admin/admin-emergency-manager";
import { EmergencyPdfUploader } from "@/components/admin/emergency-pdf-uploader";
import { db } from "@/lib/db";
import { createEmergency } from "@/lib/actions/emergency";
import { getEmergencyPdf } from "@/lib/queries";

export default async function AdminEmergencyPage() {
  const items = await db.emergencyContact.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  const pdfData = await getEmergencyPdf();

  const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.order)) + 1 : 0;

  return (
    <>
      <AdminHeader
        title="Emergency Registry"
        description="Manage contacts, custom categories, display priorities, and official PDF registry."
      />

      <div className="space-y-6">
        {/* PDF Registry Uploader */}
        <EmergencyPdfUploader initialPdf={pdfData} />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <AdminCard>
            <h3 className="mb-4 font-semibold text-ink-900">Add Emergency Contact</h3>
            <form action={createEmergency} className="grid gap-4">
              <Field
                label="Category"
                name="category"
                type="text"
                required
                placeholder="e.g. College & Hospital, College Union, Hostels, Watchmen..."
                hint="Type any custom category name freely"
              />
              <Field label="Name / Role" name="name" type="text" required placeholder="e.g. Sergeant (Mr. Abhaya Kumar)" />
              <Field label="Phone Number" name="phone" type="text" required placeholder="e.g. 0477 2282611 or 98468 35786" />
              <Field label="Description (optional)" name="description" type="text" placeholder="e.g. 24x7 service / Office hours" />
              <Field
                label="Display Order (priority)"
                name="order"
                type="number"
                defaultValue={nextOrder}
                hint="Lower numbers appear first on the website"
              />
              <Toggle label="Active" name="active" defaultChecked hint="Show on the public site" />
              <SubmitBtn>Add contact</SubmitBtn>
            </form>
          </AdminCard>

          <div>
            <AdminEmergencyManager items={items} />
          </div>
        </div>
      </div>
    </>
  );
}




