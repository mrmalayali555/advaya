import { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { InterventionsList } from "@/components/interventions/interventions-list";
import { getInterventions } from "@/lib/queries";
import { getSetting } from "@/lib/queries";
import { DEFAULT_CONTENT_LAYOUT } from "@/lib/content-layout";

export const metadata: Metadata = {
  title: "Interventions & Official Letters",
  description:
    "Official representations, letters, requests, and submissions by the Alappuzha Medical College Union to college administration and authorities.",
};

export default async function InterventionsPage() {
  const [items, layout] = await Promise.all([
    getInterventions({ publishedOnly: true }),
    getSetting("content_layout", DEFAULT_CONTENT_LAYOUT),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Official Documentation"
        title="Union Interventions"
        description="Official letters, petitions, representations, and requests submitted to or received from the Principal and other government authorities."
        breadcrumb={[{ label: "Interventions" }]}
      />
      <section className="py-12 sm:py-16">
        <Container>
          <Reveal>
            <InterventionsList items={items} columns={layout.interventions} />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
