import { Metadata } from "next";
import { Phone, Ambulance, Building2, Shield, Flame, Droplet, Siren } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Card } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { getEmergencyContacts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Emergency Registry",
  description: "Important emergency contacts — ambulance, hospital, police, fire and blood bank.",
};

const categoryIcon: Record<string, React.ReactNode> = {
  Ambulance: <Ambulance className="h-5 w-5" />,
  Hospital: <Building2 className="h-5 w-5" />,
  Police: <Shield className="h-5 w-5" />,
  "Fire Force": <Flame className="h-5 w-5" />,
  "Blood Bank": <Droplet className="h-5 w-5" />,
};

export default async function EmergencyPage() {
  const contacts = await getEmergencyContacts();

  return (
    <>
      <PageHeader
        eyebrow="Stay Safe"
        title="Emergency Registry"
        description="Keep these numbers close. In an emergency, every second counts."
        breadcrumb={[{ label: "Emergency" }]}
      />
      <section className="py-14 sm:py-20">
        <Container>
          {contacts.length === 0 ? (
            <EmptyState
              title="No emergency contacts listed yet."
              icon={<Siren className="h-7 w-7" strokeWidth={1.5} />}
            />
          ) : (
            <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {contacts.map((c) => (
                <RevealItem key={c.id}>
                  <Card interactive className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        {categoryIcon[c.category] ?? <Siren className="h-5 w-5" />}
                      </div>
                      <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-500">
                        {c.category}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-ink-900">{c.name}</h3>
                    {c.description && (
                      <p className="mt-1 text-sm text-ink-500">{c.description}</p>
                    )}
                    <a
                      href={`tel:${c.phone}`}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-purple-700"
                    >
                      <Phone className="h-4 w-4" /> {c.phone}
                    </a>
                  </Card>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </Container>
      </section>
    </>
  );
}
