import { AdminHeader } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export const metadata = {
  title: "Registration Forms | Admin",
};

export default async function RegistrationsPage() {
  const forms = await db.registrationForm.findMany({
    include: {
      event: true,
      _count: {
        select: { submissions: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Registration Forms"
        description="Manage event registrations and generic forms."
        action={{ label: "New Form", href: "/adminahnuok/registrations/new" }}
      />

      <div className="rounded-2xl border border-ink-200 bg-white shadow-soft overflow-x-auto">
        <table className="w-full text-left text-sm text-ink-600">
          <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Deadline</th>
              <th className="px-6 py-4">Submissions</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {forms.map((form) => (
              <tr key={form.id} className="transition-colors hover:bg-ink-50/50">
                <td className="px-6 py-4 font-medium text-ink-900">
                  <div className="flex flex-col">
                    <span>{form.title}</span>
                    <span className="text-xs text-ink-400 font-mono mt-0.5">/{form.slug}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {form.event ? (
                    <span className="inline-flex items-center rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-800">
                      {form.event.title}
                    </span>
                  ) : (
                    <span className="text-ink-400 italic">None</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {form.published ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {form.deadline ? new Date(form.deadline).toLocaleDateString() : "No deadline"}
                </td>
                <td className="px-6 py-4 font-mono">
                  {form._count.submissions}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/adminahnuok/registrations/${form.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 shadow-sm transition-colors hover:bg-ink-50 hover:text-ink-900"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {forms.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-ink-500">
                  No registration forms found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
