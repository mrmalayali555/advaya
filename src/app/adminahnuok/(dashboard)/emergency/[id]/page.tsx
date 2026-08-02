import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminHeader, AdminCard } from "@/components/admin/admin-ui";
import { Field, Toggle, SubmitBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { updateEmergency } from "@/lib/actions/emergency";

export default async function EditEmergencyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await db.emergencyContact.findUnique({ where: { id } });

  if (!c) notFound();

  return (
    <>
      <AdminHeader title="Edit emergency contact" description={c.name} />

      <AdminCard className="max-w-xl">
        <form action={updateEmergency.bind(null, id)} className="grid gap-4">
          <Field
            label="Category"
            name="category"
            type="text"
            defaultValue={c.category}
            required
            placeholder="e.g. College & Hospital, College Union, Hostels, Watchmen..."
            hint="Type any custom category name freely"
          />
          <Field label="Name / Role" name="name" type="text" defaultValue={c.name} required />
          <Field label="Phone Number" name="phone" type="text" defaultValue={c.phone} required />
          <Field label="Description" name="description" type="text" defaultValue={c.description ?? ""} />
          <Field
            label="Display Order (priority)"
            name="order"
            type="number"
            defaultValue={c.order}
            hint="Lower numbers appear first on the website"
          />
          <Toggle label="Active" name="active" defaultChecked={c.active} hint="Show on the public site" />
          <div className="flex items-center gap-3 pt-2">
            <SubmitBtn>Save changes</SubmitBtn>
            <Link href="/adminahnuok/emergency" className="text-sm font-medium text-ink-500 hover:text-ink-800">
              Cancel
            </Link>
          </div>
        </form>
      </AdminCard>
    </>
  );
}


