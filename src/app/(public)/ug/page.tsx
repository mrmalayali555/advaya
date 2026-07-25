import { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Card } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { getPage } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Undergraduate (UG)",
  description: "Union activities and resources for MBBS undergraduate students.",
};

export default async function UGPage() {
  const page = await getPage("ug");
  const data = (page?.data ?? {}) as Record<string, string>;

  return (
    <>
      <PageHeader
        eyebrow="Academics"
        title={page?.title ?? "Undergraduate (UG)"}
        description={data.intro}
        breadcrumb={[{ label: "UG" }]}
      />
      <section className="py-14 sm:py-20">
        <Container size="narrow">
          <Reveal>
            <Card className="p-8 text-center sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-50 text-purple-600">
                <GraduationCap className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-ink-900">
                {data.intro ? "For our UG students" : "Coming soon"}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-ink-500">
                {data.intro ||
                  "This section is being set up. Resources, schedules and UG union activities will appear here shortly."}
              </p>
            </Card>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
