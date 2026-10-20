import Link from "next/link";
import { Pencil } from "lucide-react";
import { AdminHeader, EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { formatDateRange } from "@/lib/utils";
import { Select, SubmitBtn } from "@/components/admin/form-fields";
import { AdminCard } from "@/components/admin/admin-ui";
import { db as database } from "@/lib/db";
import { saveContentLayout } from "@/lib/actions/content";
import { parseContentLayout } from "@/lib/content-layout";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ layout_saved?: string }>;
}) {
  const [{ layout_saved: layoutSaved }, events, layoutRow] = await Promise.all([
    searchParams,
    database.event.findMany({ orderBy: { date: "desc" } }),
    database.setting.findUnique({ where: { key: "content_layout" } }),
  ]);
  const layout = parseContentLayout(layoutRow?.value);

  return (
    <>
      <AdminHeader
        title="Events"
        description="Create and manage events. Upcoming ones appear on the home page."
        action={{ label: "New event", href: "/adminahnuok/events/new" }}
      />
      <AdminCard className="mb-6">
        <form action={saveContentLayout.bind(null, "events")} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-semibold text-ink-900">Mobile event layout</h2>
            <p className="mt-1 text-sm text-ink-500">Choose how many event cards appear side by side on phones.</p>
          </div>
          <div className="flex items-end gap-3">
            <Select label="Columns on mobile" name="columns" defaultValue={String(layout.events)} options={[
              { value: "1", label: "1 column" },
              { value: "2", label: "2 columns" },
              { value: "3", label: "3 columns" },
            ]} />
            <SubmitBtn>Save</SubmitBtn>
          </div>
        </form>
        {layoutSaved && <p className="mt-3 text-sm font-medium text-emerald-700" role="status">Mobile event layout saved.</p>}
      </AdminCard>

      {events.length === 0 ? (
        <EmptyRow>No events yet. Create your first one.</EmptyRow>
      ) : (
      <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
            <thead className="border-b border-ink-100 bg-ink-50/60 text-left text-xs uppercase tracking-wider text-ink-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="hidden px-5 py-3 font-semibold sm:table-cell">Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">Published</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {events.map((e) => (
                <tr key={e.id} className="transition-colors hover:bg-ink-50/50">
                  <td className="px-5 py-3.5">
                    <Link href={`/adminahnuok/events/${e.id}`} className="font-medium text-ink-900 hover:text-purple-700">
                      {e.title}
                    </Link>
                  </td>
                  <td className="hidden px-5 py-3.5 text-ink-500 sm:table-cell">{formatDateRange(e.date, e.endDate)}</td>
                  <td className="px-5 py-3.5"><StatusPill status={e.status} /></td>
                  <td className="hidden px-5 py-3.5 md:table-cell">
                    <StatusPill status={e.published ? "published" : "draft"} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/adminahnuok/events/${e.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-purple-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
