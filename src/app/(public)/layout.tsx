import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VisualEditorProvider } from "@/components/admin/visual-editor";
import { getSetting } from "@/lib/queries";
import { SITE } from "@/lib/site";
import { getFinanceConfig } from "@/lib/finance";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navSearch, contact, financeConfig] = await Promise.all([
    getSetting("nav_search", { showMobile: true, showDesktop: true }),
    getSetting("contact", { address: SITE.address, phone: SITE.phone, email: SITE.email }),
    getFinanceConfig(),
  ]);

  return (
    <VisualEditorProvider>
      <Navbar searchConfig={navSearch} financeLabel={financeConfig.title} />
      <main className="flex-1">{children}</main>
      <Footer contact={contact} />
    </VisualEditorProvider>
  );
}
