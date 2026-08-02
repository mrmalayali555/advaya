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
      <div className="lg:pl-64 min-w-0 w-full overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-10 min-w-0 w-full">{children}</div>
      </div>
    </div>
  );
}

