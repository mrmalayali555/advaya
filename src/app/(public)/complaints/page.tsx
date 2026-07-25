import { Metadata } from "next";
import { ShieldCheck, Eye, MessageSquareWarning } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { ComplaintForm } from "@/components/forms/complaint-form";

export const metadata: Metadata = {
  title: "Drop Your Suggestion",
  description:
    "Drop a suggestion to the ADVAYA union — anonymously or named. Every voice matters.",
};

export default function ComplaintsPage() {
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
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title="Anonymous by default"
                  text="Speak freely. If you choose anonymous, we never store your name or email."
                />
                <Feature
                  icon={<Eye className="h-5 w-5" />}
                  title="Seen by the union"
                  text="Complaints go straight to the union office bearers for review and action."
                />
                <Feature
                  icon={<MessageSquareWarning className="h-5 w-5" />}
                  title="No issue too small"
                  text="Academics, facilities, ragging, safety — whatever it is, we want to know."
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
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-ink-900">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-500">{text}</p>
      </div>
    </div>
  );
}
