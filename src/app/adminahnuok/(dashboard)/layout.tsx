import { Metadata } from "next";
import { requireAdmin } from "@/lib/require-admin";
import { Sidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · ADVAYA Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-[100dvh] bg-ink-50">
      <Sidebar admin={{ name: admin.name, email: admin.email }} />
      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">{children}</div>
      </div>
    </div>
  );
}

