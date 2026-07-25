import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminHeader, AdminCard } from "@/components/admin/admin-ui";
import { Field, TextArea, SubmitBtn, DeleteBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { updateCommittee, deleteCommittee } from "@/lib/actions/committees";

export default async function EditCommitteePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await db.committee.findUnique({ where: { id } });
  if (!c) notFound();

  return (
    <>
      <AdminHeader title="Edit committee" description={c.name} />
      <AdminCard className="max-w-xl">
        <form action={updateCommittee.bind(null, id)} className="grid gap-4">
          <Field label="Name" name="name" defaultValue={c.name} required />
          <TextArea label="Description" name="description" defaultValue={c.description ?? ""} rows={2} />
          <Field label="Order" name="order" type="number" defaultValue={c.order} />
          <div className="flex items-center gap-3">
            <SubmitBtn>Save changes</SubmitBtn>
            <Link href="/admin/committees" className="text-sm font-medium text-ink-500 hover:text-ink-800">Cancel</Link>
          </div>
        </form>
      </AdminCard>
      <form action={deleteCommittee.bind(null, id)} className="mt-6">
        <DeleteBtn label="Delete committee" />
      </form>
    </>
  );
}
