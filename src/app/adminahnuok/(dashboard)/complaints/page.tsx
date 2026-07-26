import Link from "next/link";
import { AdminHeader, EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { timeAgo, truncate } from "@/lib/utils";

export default async function AdminComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = "all", q = "" } = await searchParams;
  const items = await db.complaint.findMany({
    where: {
      ...(status !== "all" ? { status } : {}),
      ...(q ? { message: { contains: q } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const tabs = [
    { key: "all", label: "All" },
    { key: "new", label: "New" },
    { key: "read", label: "Read" },
    { key: "resolved", label: "Resolved" },
  ];

  return (
    <>
      <AdminHeader title="Suggestions" description="Every suggestion students submit lands here." />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key === "all" ? "/adminahnuok/complaints" : `/adminahnuok/complaints?status=${t.key}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              status === t.key ? "bg-purple-600 text-white" : "border border-ink-200 bg-white text-ink-600 hover:text-purple-700"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyRow>No suggestions{status !== "all" ? ` marked “${status}”` : ""} yet.</EmptyRow>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <Link
              key={c.id}
              href={`/adminahnuok/complaints/${c.id}`}
              className="block rounded-2xl border border-ink-100 bg-white p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink-900">
                    {c.anonymous ? "Anonymous" : c.name || "Named"}
                  </span>
                  <StatusPill status={c.status} />
                </div>
                <span className="text-xs text-ink-400">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm text-ink-600">{truncate(c.message, 160)}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

