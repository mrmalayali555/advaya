import { Metadata } from "next";
import { Target, Eye, History, Quote } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Card } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { getPage } from "@/lib/queries";
import { SITE } from "@/lib/site";
import { EditableText } from "@/components/admin/visual-editor";

export const metadata: Metadata = {
  title: "About the Union",
  description:
    "The story, mission and vision of ADVAYA — the student union of Alappuzha Medical College.",
};

export default async function AboutPage() {
  const page = await getPage("about");
  const d = (page?.data ?? {}) as Record<string, string>;

  return (
    <>
      <PageHeader
        eyebrow="Who We Are"
        title={page?.title ?? "About the Union"}
        description={`The elected student voice of ${SITE.college}.`}
        breadcrumb={[{ label: "About Union" }]}
      />

      <section className="py-14 sm:py-20">
        <Container size="narrow">
          {d.history && (
            <Reveal>
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink-900">
                    <EditableText type="page" keyName="about" field="history_title">
                      {d.history_title || "Our story"}
                    </EditableText>
                  </h2>
                  <p className="mt-2 leading-relaxed text-ink-600">
                    <EditableText type="page" keyName="about" field="history">
                      {d.history}
                    </EditableText>
                  </p>
                </div>
              </div>
            </Reveal>
          )}

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <Reveal>
              <Card className="h-full p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink-900">
                  <EditableText type="page" keyName="about" field="mission_title">
                    {d.mission_title || "Mission"}
                  </EditableText>
                </h3>
                <p className="mt-2 leading-relaxed text-ink-600">
                  <EditableText type="page" keyName="about" field="mission">
                    {d.mission}
                  </EditableText>
                </p>
              </Card>
            </Reveal>
            <Reveal delay={1}>
              <Card className="h-full p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink-900">
                  <EditableText type="page" keyName="about" field="vision_title">
                    {d.vision_title || "Vision"}
                  </EditableText>
                </h3>
                <p className="mt-2 leading-relaxed text-ink-600">
                  <EditableText type="page" keyName="about" field="vision">
                    {d.vision}
                  </EditableText>
                </p>
              </Card>
            </Reveal>
          </div>

          {d.chairperson && (
            <Reveal>
              <Card className="mt-10 overflow-hidden">
                <div className="relative bg-mesh p-8 sm:p-12">
                  <Quote className="h-10 w-10 text-purple-400" />
                  <p className="mt-5 text-xl font-medium leading-relaxed text-ink-800">
                    <EditableText type="page" keyName="about" field="chairperson">
                      {d.chairperson}
                    </EditableText>
                  </p>
                  <p className="mt-6 text-sm font-semibold text-purple-700">
                    <EditableText type="page" keyName="about" field="chairperson_title_about">
                      {d.chairperson_title_about || "— Message from the Chairperson"}
                    </EditableText>
                  </p>
                </div>
              </Card>
            </Reveal>
          )}
        </Container>
      </section>
    </>
  );
}
