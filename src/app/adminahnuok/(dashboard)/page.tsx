import Link from "next/link";
import { Trophy, CalendarDays, Bell, MessageSquareWarning, ArrowUpRight } from "lucide-react";
import { AdminHeader, StatCard, AdminCard, EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { formatDate, timeAgo } from "@/lib/utils";

export default async function DashboardPage() {
  const admin = await requireAdmin();

  const [achievements, events, notifications, complaints, newComplaints, recentComplaints, recentEvents] =
    await Promise.all([
      db.achievement.count(),
      db.event.count(),
      db.notification.count(),
      db.complaint.count(),
      db.complaint.count({ where: { status: "new" } }),
      db.complaint.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      db.event.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  return (
    <>
      <AdminHeader
        title={`Welcome back, ${admin.name.split(" ")[0]}`}
        description="Here's what's happening across ADVAYA."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Achievements" value={achievements} href="/adminahnuok/achievements" icon={<Trophy className="h-5 w-5" />} />
        <StatCard label="Events" value={events} href="/adminahnuok/events" icon={<CalendarDays className="h-5 w-5" />} />
        <StatCard label="Notifications" value={notifications} href="/adminahnuok/notifications" icon={<Bell className="h-5 w-5" />} />
        <StatCard
          label={newComplaints > 0 ? `Complaints (${newComplaints} new)` : "Complaints"}
          value={complaints}
          href="/adminahnuok/complaints"
          icon={<MessageSquareWarning className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">Recent complaints</h2>
            <Link href="/adminahnuok/complaints" className="text-sm font-medium text-purple-600 hover:underline">
              View all
            </Link>
          </div>
          {recentComplaints.length === 0 ? (
            <EmptyRow>No complaints yet.</EmptyRow>
          ) : (
            <ul className="divide-y divide-ink-100">
              {recentComplaints.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/adminahnuok/complaints/${c.id}`}
                    className="group flex items-start gap-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-ink-800">
                          {c.anonymous ? "Anonymous" : c.name || "Named"}
                        </span>
                        <StatusPill status={c.status} />
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-sm text-ink-500">{c.message}</p>
                    </div>
                    <span className="shrink-0 text-xs text-ink-400">{timeAgo(c.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">Recent events</h2>
            <Link href="/adminahnuok/events" className="text-sm font-medium text-purple-600 hover:underline">
              View all
            </Link>
          </div>
          {recentEvents.length === 0 ? (
            <EmptyRow>No events yet.</EmptyRow>
          ) : (
            <ul className="divide-y divide-ink-100">
              {recentEvents.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/adminahnuok/events/${e.id}`}
                    className="group flex items-center gap-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-ink-800">{e.title}</span>
                        <StatusPill status={e.status} />
                      </div>
                      <p className="mt-0.5 text-xs text-ink-400">{formatDate(e.date)}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </>
  );
}

