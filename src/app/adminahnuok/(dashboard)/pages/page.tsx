import { AdminHeader, AdminCard } from "@/components/admin/admin-ui";
import { Field, TextArea, SubmitBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { savePage } from "@/lib/actions/content";

async function getAboutData() {
  const p = await db.page.findUnique({ where: { key: "about" } });
  let data: Record<string, string> = {};
  try {
    data = p?.content ? JSON.parse(p.content) : {};
  } catch {}
  return { title: p?.title ?? "", data };
}

export default async function AdminPagesPage() {
  const about = await getAboutData();

  return (
    <>
      <AdminHeader title="Pages" description="Edit the About Union page content." />

      <div className="space-y-8">
        {/* About page — keep the simple form */}
        <AdminCard>
          <h3 className="mb-4 font-semibold text-ink-900">About the Union</h3>
          <form action={savePage.bind(null, "about")} className="grid gap-4">
            <Field label="Page title" name="title" defaultValue={about.title || "About the Union"} />
            <TextArea label="History / Story" name="history" defaultValue={about.data.history} rows={3} />
            <TextArea label="Mission" name="mission" defaultValue={about.data.mission} rows={2} />
            <TextArea label="Vision" name="vision" defaultValue={about.data.vision} rows={2} />
            <TextArea label="Message from Chairperson" name="chairperson" defaultValue={about.data.chairperson} rows={3} />
            <SubmitBtn>Save About page</SubmitBtn>
          </form>
        </AdminCard>
      </div>
    </>
  );
}
