import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cookies } from "next/headers";
import { VisualEditorProvider } from "@/components/admin/visual-editor";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("advaya_session");

  return (
    <VisualEditorProvider isAdmin={isAdmin}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </VisualEditorProvider>
  );
}
