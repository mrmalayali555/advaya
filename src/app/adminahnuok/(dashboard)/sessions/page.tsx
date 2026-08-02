import { AdminHeader, AdminCard, EmptyRow } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Smartphone, Monitor, Globe, Clock, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function revokeSession(formData: FormData) {
  "use server";
  const sessionId = formData.get("id") as string;
  await db.adminSession.delete({ where: { id: sessionId } });
  revalidatePath("/adminahnuok/sessions");
}

export default async function AdminSessionsPage() {
  const currentSession = await getSession();
  if (!currentSession) redirect("/adminahnuok/login");

  const sessions = await db.adminSession.findMany({
    orderBy: { lastActiveAt: "desc" },
    include: { admin: { select: { email: true, name: true } } }
  });

  return (
    <>
      <AdminHeader 
        title="Active Sessions" 
        description="Monitor who is logged into the admin panel and from where. You can revoke any suspicious sessions." 
      />

      {sessions.length === 0 ? (
        <EmptyRow>No active sessions found.</EmptyRow>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => {
            const isMobile = s.userAgent?.toLowerCase().includes("mobile");
            const isCurrent = s.adminId === currentSession.sub; // Or maybe by token if we had it
            
            return (
              <AdminCard key={s.id} className="transition-all hover:border-purple-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                      {isMobile ? <Smartphone className="h-6 w-6" /> : <Monitor className="h-6 w-6" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-ink-900 truncate">{s.admin.name} ({s.admin.email})</h3>
                        {isCurrent && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                            Current Session
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-ink-500">
                        <span className="flex items-center gap-1.5 break-all">
                          <Globe className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                          {s.location || "Unknown location"} (IP: {s.ipAddress})
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-purple-400" />
                          Last active: {new Date(s.lastActiveAt).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="mt-1.5 text-[10px] text-ink-400 font-mono truncate max-w-lg">
                        {s.userAgent}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-ink-100 pt-3 sm:border-t-0 sm:pt-0">
                    <form action={revokeSession}>
                      <input type="hidden" name="id" value={s.id} />
                      <button
                        type="submit"
                        className="inline-flex min-h-[36px] items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" /> Revoke
                      </button>
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
