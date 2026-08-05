import { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Card } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { GraduationCap } from "lucide-react";
import { getPage } from "@/lib/queries";
import { parsePageContent } from "@/lib/page-builder-types";
import { PageRenderer } from "@/components/page-builder/page-renderer";
import { EditableText } from "@/components/admin/visual-editor";

export const metadata: Metadata = {
  title: "Undergraduate (UG)",
  description: "Union activities and resources for MBBS undergraduate students.",
};

export default async function UGPage() {
  const page = await getPage("ug");
  const rawData = (page?.data ?? {}) as Record<string, unknown>;
  const content = parsePageContent(page?.content ?? null);
  const hasSections = content.sections.length > 0;

  return (
    <>
      <PageHeader
        eyebrow={content.settings?.eyebrow || "Academics"}
        title={page?.title ?? "Undergraduate (UG)"}
        description={rawData.intro as string | undefined}
        breadcrumb={[{ label: "UG" }]}
      />

      {hasSections ? (
        /* ─── Page Builder sections ─── */
        <PageRenderer sections={content.sections} settings={content.settings} />
      ) : (
        /* ─── Fallback: original glass card (backwards compat) ─── */
        <section className="py-14 sm:py-20">
          <Container size="narrow">
            <Reveal>
              <Card className="glass-card p-8 text-center sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-500/10 text-purple-400">
                  <GraduationCap className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-on-surface">
                  For our UG students
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-on-surface-variant">
                  <EditableText type="page" keyName="ug" field="intro">
                    {(rawData.intro as string) ||
                      "This section is being set up. Resources, schedules and UG union activities will appear here shortly."}
                  </EditableText>
                </p>
              </Card>
            </Reveal>
          </Container>
        </section>
      )}
    </>
  );
}
