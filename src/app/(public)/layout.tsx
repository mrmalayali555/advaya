import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VisualEditorProvider } from "@/components/admin/visual-editor";
import { getSetting } from "@/lib/queries";
import { SITE } from "@/lib/site";

export const revalidate = 60;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
