import Link from "next/link";
import { Plus, Pencil, Trash2, Pin, Eye, EyeOff, FileText, Calendar } from "lucide-react";
import { AdminHeader, AdminCard, EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { DeleteBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import {
  deleteIntervention,
  togglePublishIntervention,
  togglePinIntervention,
} from "@/lib/actions/interventions";

export default async function AdminInterventionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = "all", q = "" } = await searchParams;

  const items = await db.intervention.findMany({
    where: {
      ...(status === "published" ? { published: true } : {}),
      ...(status === "draft" ? { published: false } : {}),
      ...(status === "pinned" ? { pinned: true } : {}),
      ...(q ? { OR: [{ title: { contains: q } }, { description: { contains: q } }] } : {}),
    },
    orderBy: [{ pinned: "desc" }, { date: "desc" }],
  });

  const tabs = [
    { key: "all", label: "All" },
    { key: "published", label: "Published" },
    { key: "draft", label: "Drafts" },
    { key: "pinned", label: "Pinned" },
  ];

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminHeader
          title="Interventions"
          description="Manage official letters, representations, and requests to authorities."
        />
        <Link
          href="/admin/interventions/new"
          className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" /> Add intervention
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key === "all" ? "/admin/interventions" : `/admin/interventions?status=${t.key}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              status === t.key
                ? "bg-purple-600 text-white"
                : "border border-ink-200 bg-white text-ink-600 hover:text-purple-700"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* List */}
      {items.length === 0 ? (
        <EmptyRow>No interventions found{status !== "all" ? ` for "${status}"` : ""}.</EmptyRow>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const formattedDate = formatDate(item.date);
            return (
              <AdminCard key={item.id} className="transition-all hover:border-purple-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                      <FileText className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-ink-900 truncate">{item.title}</h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            item.published
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {item.published ? "Published" : "Draft"}
                        </span>
                        {item.pinned && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700">
                            <Pin className="h-3 w-3 fill-current" /> Pinned
                          </span>
                        )}
                        {item.category && (
                          <span className="rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-600">
                            {item.category}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-500">
                        {item.description}
                      </p>

                      <div className="mt-2 flex items-center gap-3 text-xs text-ink-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-purple-500" /> {formattedDate}
                        </span>
                        {item.pdfUrl && <span className="text-purple-600 font-medium">PDF Attached</span>}
                        {item.image && <span>• Cover Image</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-ink-100 pt-3 sm:border-t-0 sm:pt-0">
                    <form action={togglePinIntervention.bind(null, item.id, item.pinned)}>
                      <button
                        type="submit"
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                          item.pinned
                            ? "border-purple-200 bg-purple-50 text-purple-700"
                            : "border-ink-200 text-ink-400 hover:bg-ink-50 hover:text-purple-600"
                        }`}
                        title={item.pinned ? "Unpin" : "Pin to top"}
                      >
                        <Pin className="h-4 w-4" />
                      </button>
                    </form>

                    <form action={togglePublishIntervention.bind(null, item.id, item.published)}>
                      <button
                        type="submit"
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                          item.published
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-ink-200 text-ink-400 hover:bg-ink-50 hover:text-emerald-600"
                        }`}
                        title={item.published ? "Unpublish (Save as draft)" : "Publish"}
                      >
                        {item.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </form>

                    <Link
                      href={`/admin/interventions/${item.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink-200 text-ink-600 transition-colors hover:bg-purple-50 hover:text-purple-700"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    <form action={deleteIntervention.bind(null, item.id)}>
                      <DeleteBtn label="" />
                    </form>
                  </div>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}
    </>
  );
}
