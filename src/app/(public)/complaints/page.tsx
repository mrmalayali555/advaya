import { Metadata } from "next";
import { ShieldCheck, Eye, MessageSquareWarning } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { ComplaintForm } from "@/components/forms/complaint-form";

import { EditableText } from "@/components/admin/visual-editor";
import { getSetting } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Drop Your Suggestion",
  description:
    "Drop a suggestion to the ADVAYA union — anonymously or named. Every voice matters.",
};

export default async function ComplaintsPage() {
  const complaints = await getSetting("complaints", {
    showIcons: true,
    f1_title: "Anonymous by default",
    f1_text: "Speak freely. If you choose anonymous, we never store your name or email.",
    f2_title: "Seen by the union",
    f2_text: "Complaints go straight to the union office bearers for review and action.",
    f3_title: "No issue too small",
    f3_text: "Academics, facilities, ragging, safety — whatever it is, we want to know.",
  });

  return (
    <>
      <PageHeader
        eyebrow="We're Listening"
        title="Drop Your Suggestion"
        description="Have a suggestion or concern? Share it with the union — anonymously or with your name. We read every single one."
        breadcrumb={[{ label: "Suggestions" }]}
      />
      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <div className="space-y-6">
                <Feature
                  icon={complaints.showIcons && <ShieldCheck className="h-5 w-5" />}
                  title={<EditableText type="setting" keyName="complaints" field="f1_title">{complaints.f1_title}</EditableText>}
                  text={<EditableText type="setting" keyName="complaints" field="f1_text">{complaints.f1_text}</EditableText>}
                />
                <Feature
                  icon={complaints.showIcons && <Eye className="h-5 w-5" />}
                  title={<EditableText type="setting" keyName="complaints" field="f2_title">{complaints.f2_title}</EditableText>}
                  text={<EditableText type="setting" keyName="complaints" field="f2_text">{complaints.f2_text}</EditableText>}
                />
                <Feature
                  icon={complaints.showIcons && <MessageSquareWarning className="h-5 w-5" />}
                  title={<EditableText type="setting" keyName="complaints" field="f3_title">{complaints.f3_title}</EditableText>}
                  text={<EditableText type="setting" keyName="complaints" field="f3_text">{complaints.f3_text}</EditableText>}
                />
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ComplaintForm />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  text: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      {icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-900/30 text-purple-400">
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-semibold text-on-surface">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{text}</p>
      </div>
    </div>
  );
}
