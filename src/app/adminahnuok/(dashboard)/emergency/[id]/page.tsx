import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminHeader, AdminCard } from "@/components/admin/admin-ui";
import { Field, Select, Toggle, SubmitBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { updateEmergency } from "@/lib/actions/emergency";

const CATEGORIES = ["Ambulance", "Hospital", "Police", "Fire Force", "Blood Bank", "Other"];

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
          <Select label="Category" name="category" defaultValue={c.category} options={CATEGORIES.map((x) => ({ value: x, label: x }))} />
          <Field label="Name" name="name" defaultValue={c.name} required />
          <Field label="Phone" name="phone" defaultValue={c.phone} required />
          <Field label="Description" name="description" defaultValue={c.description ?? ""} />
          <Field label="Order" name="order" type="number" defaultValue={c.order} />
          <Toggle label="Active" name="active" defaultChecked={c.active} />
          <div className="flex items-center gap-3">
            <SubmitBtn>Save changes</SubmitBtn>
            <Link href="/admin/emergency" className="text-sm font-medium text-ink-500 hover:text-ink-800">Cancel</Link>
          </div>
        </form>
      </AdminCard>
    </>
  );
}
