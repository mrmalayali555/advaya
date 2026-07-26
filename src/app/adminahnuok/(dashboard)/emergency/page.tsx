import Link from "next/link";
import { Pencil, Phone } from "lucide-react";
import { AdminHeader, AdminCard, EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { Field, Select, Toggle, SubmitBtn, DeleteBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { createEmergency, deleteEmergency } from "@/lib/actions/emergency";

const CATEGORIES = ["Ambulance", "Hospital", "Police", "Fire Force", "Blood Bank", "Other"];

export default async function AdminEmergencyPage() {
  const items = await db.emergencyContact.findMany({ orderBy: [{ order: "asc" }, { category: "asc" }] });

  return (
    <>
      <AdminHeader title="Emergency Registry" description="Manage emergency contact numbers." />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <AdminCard>
          <h3 className="mb-4 font-semibold text-ink-900">Add contact</h3>
          <form action={createEmergency} className="grid gap-4">
            <Select label="Category" name="category" options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
            <Field label="Name" name="name" required placeholder="College Ambulance" />
            <Field label="Phone" name="phone" required placeholder="108" />
            <Field label="Description (optional)" name="description" placeholder="24x7 service" />
            <Field label="Order" name="order" type="number" defaultValue={0} />
            <Toggle label="Active" name="active" defaultChecked hint="Show on the public site" />
            <SubmitBtn>Add contact</SubmitBtn>
          </form>
        </AdminCard>

        <div>
          {items.length === 0 ? (
            <EmptyRow>No emergency contacts yet.</EmptyRow>
          ) : (
            <div className="space-y-3">
              {items.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-[var(--shadow-soft)]">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ink-900">{c.name}</span>
                      {!c.active && <StatusPill status="draft" />}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-400">
                      <span className="rounded-full bg-ink-100 px-2 py-0.5">{c.category}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link href={`/adminahnuok/emergency/${c.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-purple-600">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={deleteEmergency.bind(null, c.id)}>
                      <DeleteBtn label="" />
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

