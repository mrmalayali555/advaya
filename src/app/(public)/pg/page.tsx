import { Metadata } from "next";
import { Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Card } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { getPage } from "@/lib/queries";
import { EditableText } from "@/components/admin/visual-editor";

export const metadata: Metadata = {
  title: "Postgraduate (PG)",
  description: "Union support and notices for Postgraduate residents and fellows.",
};

export default async function PGPage() {
  const page = await getPage("pg");
  const data = (page?.data ?? {}) as Record<string, string>;

  return (
    <>
      <PageHeader
        eyebrow="Residency"
        title={page?.title ?? "Postgraduate (PG)"}
        description={data.intro}
        breadcrumb={[{ label: "PG" }]}
      />
      <section className="py-14 sm:py-20">
        <Container size="narrow">
          <Reveal>
            <Card className="p-8 text-center sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-50 text-purple-600">
                <Stethoscope className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-ink-900">
                For our PG residents
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-ink-500">
                <EditableText type="page" keyName="pg" field="intro">
                  {data.intro ||
                    "This section is being set up. Residency updates, duty schedules and PG union notices will appear here shortly."}
                </EditableText>
              </p>
            </Card>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
