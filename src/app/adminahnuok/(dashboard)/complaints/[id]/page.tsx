import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Mail, ShieldCheck } from "lucide-react";
import { AdminHeader, AdminCard, StatusPill } from "@/components/admin/admin-ui";
import { DeleteBtn, SubmitBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { setComplaintStatus, deleteComplaint } from "@/lib/actions/complaints";

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await db.complaint.findUnique({ where: { id } });
  if (!c) notFound();

  // Auto-mark as read the first time it's opened.
  if (c.status === "new") {
    await db.complaint.update({ where: { id }, data: { status: "read" } });
  }

  return (
    <>
      <Link href="/adminahnuok/complaints" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-purple-700">
        <ArrowLeft className="h-4 w-4" /> Back to complaints
      </Link>
      <AdminHeader title="Complaint" description={formatDate(c.createdAt)} />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <AdminCard>
          <div className="mb-4 flex items-center gap-2">
            <StatusPill status={c.status === "new" ? "read" : c.status} />
            {c.anonymous && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                <ShieldCheck className="h-3 w-3" /> Anonymous
              </span>
            )}
          </div>
          <p className="whitespace-pre-line leading-relaxed text-ink-700">{c.message}</p>
        </AdminCard>

        <div className="space-y-6">
          <AdminCard>
            <h3 className="mb-3 text-sm font-semibold text-ink-900">Submitted by</h3>
            {c.anonymous ? (
              <p className="text-sm text-ink-500">This complaint was submitted anonymously.</p>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-ink-600">
                  <User className="h-4 w-4 text-purple-500" /> {c.name || "—"}
                </div>
                {c.email && (
                  <div className="flex items-center gap-2 text-ink-600">
                    <Mail className="h-4 w-4 text-purple-500" />
                    <a href={`mailto:${c.email}`} className="hover:text-purple-700">{c.email}</a>
                  </div>
                )}
              </div>
            )}
          </AdminCard>

          <AdminCard>
            <h3 className="mb-3 text-sm font-semibold text-ink-900">Update status</h3>
            <form action={setComplaintStatus.bind(null, id)} className="space-y-3">
              <select
                name="status"
                defaultValue={c.status === "new" ? "read" : c.status}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="resolved">Resolved</option>
              </select>
              <SubmitBtn>Update</SubmitBtn>
            </form>
          </AdminCard>

          <form action={deleteComplaint.bind(null, id)}>
            <DeleteBtn label="Delete complaint" />
          </form>
        </div>
      </div>
    </>
  );
}
