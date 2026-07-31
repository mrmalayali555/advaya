import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VisualEditorProvider } from "@/components/admin/visual-editor";
export const revalidate = 60;

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VisualEditorProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </VisualEditorProvider>
  );
}
