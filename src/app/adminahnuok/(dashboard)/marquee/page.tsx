import { AdminHeader } from "@/components/admin/admin-ui";
import { Field, TextArea, Toggle, SubmitBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { saveMarquee } from "@/lib/actions/marquee";

export default async function AdminMarqueePage() {
  const marquee = await db.marquee.findFirst({ orderBy: { updatedAt: "desc" } });
  const speedSetting = await db.setting.findUnique({ where: { key: "marquee_speed" } });

  return (
    <>
      <AdminHeader
        title="Marquee"
        description="The scrolling announcement bar at the bottom of every page."
      />
      <form action={saveMarquee} className="space-y-6">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="grid gap-5">
            <Toggle label="Enable marquee" name="enabled" defaultChecked={marquee?.enabled ?? true} hint="Turn the announcement bar on or off" />
            <TextArea label="Scrolling text" name="text" defaultValue={marquee?.text} required rows={2} placeholder="Holiday declared on 15 October." />
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Button text (optional)" name="buttonText" defaultValue={marquee?.buttonText ?? ""} placeholder="Click Here" />
              <Field label="Button link (optional)" name="buttonUrl" defaultValue={marquee?.buttonUrl ?? ""} placeholder="/notifications" hint="A path like /events or a full URL" />
              
              {/* Load current speed setting */}
              {(() => {
                const speedVal = marquee ? 8 : 8; // we'll fetch from DB below
                return (
                  <Field 
                    label="Scroll Speed (laptop/mobile)" 
                    name="speed" 
                    type="number" 
                    defaultValue={speedSetting ? parseInt(speedSetting.value) : 8} 
                    hint="1 (very slow) to 20 (fast). Default is 8."
                  />
                );
              })()}
            </div>
          </div>
        </div>
        <SubmitBtn>Save marquee</SubmitBtn>
      </form>
    </>
  );
}

