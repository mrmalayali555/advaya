import { AdminHeader, AdminCard } from "@/components/admin/admin-ui";
import { Field, TextArea, SubmitBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { saveSettingsForm } from "@/lib/actions/content";
import { SITE } from "@/lib/site";

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await db.setting.findUnique({ where: { key } });
  try {
    return row?.value ? (JSON.parse(row.value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default async function AdminSettingsPage() {
  const [hero, contact, stats] = await Promise.all([
    getSetting("hero", { badge: SITE.college, title: "The voice of every student.", subtitle: SITE.description }),
    getSetting("contact", { address: SITE.address, phone: SITE.phone, email: SITE.email }),
    getSetting("stats", { students: 1200, events: 48, achievements: 96, committees: 12 }),
  ]);

  return (
    <>
      <AdminHeader title="Settings" description="Control the homepage hero, contact details and stat counters." />

      <form action={saveSettingsForm} className="space-y-8">
        <AdminCard>
          <h3 className="mb-4 font-semibold text-ink-900">Homepage hero</h3>
          <div className="grid gap-4">
            <Field label="Badge text" name="hero_badge" defaultValue={hero.badge} hint="The small pill above the title" />
            <Field label="Title" name="hero_title" defaultValue={hero.title} hint="Last two words are highlighted in purple" />
            <TextArea label="Subtitle" name="hero_subtitle" defaultValue={hero.subtitle} rows={2} />
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="mb-4 font-semibold text-ink-900">Stat counters</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Students" name="stats_students" type="number" defaultValue={stats.students} />
            <Field label="Events" name="stats_events" type="number" defaultValue={stats.events} />
            <Field label="Achievements" name="stats_achievements" type="number" defaultValue={stats.achievements} />
            <Field label="Committees" name="stats_committees" type="number" defaultValue={stats.committees} />
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="mb-4 font-semibold text-ink-900">Contact details</h3>
          <div className="grid gap-4">
            <TextArea label="Address" name="contact_address" defaultValue={contact.address} rows={2} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone" name="contact_phone" defaultValue={contact.phone} />
              <Field label="Email" name="contact_email" defaultValue={contact.email} />
            </div>
          </div>
        </AdminCard>

        <SubmitBtn>Save all settings</SubmitBtn>
      </form>

      {/* Data Backup Section */}
      <div className="mt-8 space-y-4">
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-ink-900">Data Backup</h3>
              <p className="mt-1 text-sm text-ink-500">
                Export all database records (Events, Complaints, Users, etc.) as a JSON file.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-ink-200 bg-ink-50/50 p-4 flex items-center justify-between">
            <div className="text-sm text-ink-700">Download complete system backup</div>
            <a
              href="/api/admin/backup"
              download
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink-700 shadow-sm border border-ink-200 hover:bg-ink-50 transition-colors"
            >
              Download JSON
            </a>
          </div>
        </AdminCard>
      </div>
    </>
  );
}

