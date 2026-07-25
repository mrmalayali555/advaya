import Link from "next/link";
import { Pencil } from "lucide-react";
import { AdminHeader, EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminEventsPage() {
  const events = await db.event.findMany({ orderBy: { date: "desc" } });

  return (
    <>
      <AdminHeader
        title="Events"
        description="Create and manage events. Upcoming ones appear on the home page."
        action={{ label: "New event", href: "/admin/events/new" }}
      />

      {events.length === 0 ? (
        <EmptyRow>No events yet. Create your first one.</EmptyRow>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[var(--shadow-soft)]">
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
                    <Link href={`/admin/events/${e.id}`} className="font-medium text-ink-900 hover:text-purple-700">
                      {e.title}
                    </Link>
                  </td>
                  <td className="hidden px-5 py-3.5 text-ink-500 sm:table-cell">{formatDate(e.date)}</td>
                  <td className="px-5 py-3.5"><StatusPill status={e.status} /></td>
                  <td className="hidden px-5 py-3.5 md:table-cell">
                    <StatusPill status={e.published ? "published" : "draft"} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/events/${e.id}`}
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
