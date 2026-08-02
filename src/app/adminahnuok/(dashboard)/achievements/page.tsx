import Link from "next/link";
import { Pencil } from "lucide-react";
import { AdminHeader, EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminAchievementsPage() {
  const items = await db.achievement.findMany({ orderBy: { date: "desc" } });
  return (
    <>
      <AdminHeader
        title="Achievements"
        description="Celebrate wins across sports, arts and academics."
        action={{ label: "New achievement", href: "/adminahnuok/achievements/new" }}
      />
      {items.length === 0 ? (
        <EmptyRow>No achievements yet.</EmptyRow>
      ) : (
      <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
            <thead className="border-b border-ink-100 bg-ink-50/60 text-left text-xs uppercase tracking-wider text-ink-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="hidden px-5 py-3 font-semibold sm:table-cell">Date</th>
                <th className="px-5 py-3 font-semibold">Published</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {items.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-ink-50/50">
                  <td className="px-5 py-3.5">
                    <Link href={`/adminahnuok/achievements/${a.id}`} className="font-medium text-ink-900 hover:text-purple-700">
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5"><StatusPill status={a.category} /></td>
                  <td className="hidden px-5 py-3.5 text-ink-500 sm:table-cell">{formatDate(a.date)}</td>
                  <td className="px-5 py-3.5"><StatusPill status={a.published ? "published" : "draft"} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/adminahnuok/achievements/${a.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-purple-600">
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

