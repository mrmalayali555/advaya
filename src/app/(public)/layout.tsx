import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VisualEditorProvider } from "@/components/admin/visual-editor";
import { MaintenancePage } from "@/components/layout/maintenance-page";
import { getSetting } from "@/lib/queries";
import { isMaintenanceMode } from "@/lib/maintenance";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (await isMaintenanceMode()) {
    return <MaintenancePage />;
  }

  const [navSearch, contact] = await Promise.all([
    getSetting("nav_search", { showMobile: true, showDesktop: true }),
    getSetting("contact", { address: SITE.address, phone: SITE.phone, email: SITE.email }),
  ]);

  return (
    <VisualEditorProvider>
      <Navbar searchConfig={navSearch} />
      <main className="flex-1">{children}</main>
      <Footer contact={contact} />
    </VisualEditorProvider>
  );
}
