import { AdminHeader } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, DownloadIcon, FileIcon } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "Submissions | Admin",
};

export default async function RegistrationSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const form = await db.registrationForm.findUnique({
    where: { id },
    include: {
      fields: { orderBy: { order: "asc" } },
      submissions: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!form) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/adminahnuok/registrations/${form.id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Form Builder
        </Link>
        <AdminHeader 
          title={`Submissions: ${form.title}`} 
          description={`${form.submissions.length} total entries.`} 
          action={{ label: "Export CSV", href: `/api/admin/registration/export?formId=${form.id}` }}
        />
      </div>

      <div className="rounded-2xl border border-ink-200 bg-white shadow-soft overflow-x-auto">
        <table className="w-full text-left text-sm text-ink-600 whitespace-nowrap">
          <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-6 py-4">Date</th>
              {form.fields.map(f => (
                <th key={f.id} className="px-6 py-4">{f.label}</th>
              ))}
              <th className="px-6 py-4">Files</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {form.submissions.map((sub) => {
              let data: Record<string, any> = {};
              try { data = JSON.parse(sub.data); } catch (e) {}

              let files: Record<string, string> = {};
              try { files = sub.files ? JSON.parse(sub.files) : {}; } catch (e) {}

              return (
                <tr key={sub.id} className="transition-colors hover:bg-ink-50/50">
                  <td className="px-6 py-4 text-xs text-ink-500">
                    {formatDateTime(sub.createdAt)}
                  </td>
                  {form.fields.map(f => (
                    <td key={f.id} className="px-6 py-4 max-w-[200px] truncate" title={String(data[f.id] || "")}>
                      {String(data[f.id] || "-")}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {Object.entries(files).map(([fieldId, url]) => (
                        <a 
                          key={fieldId} 
                          href={url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 text-xs font-medium"
                        >
                          <FileIcon className="h-3 w-3" />
                          File
                        </a>
                      ))}
                      {Object.keys(files).length === 0 && <span className="text-ink-400">-</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
            {form.submissions.length === 0 && (
              <tr>
                <td colSpan={form.fields.length + 2} className="px-6 py-12 text-center text-ink-500">
                  No submissions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
