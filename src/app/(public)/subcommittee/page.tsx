import { Metadata } from "next";
import Image from "next/image";
import { Users, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Card } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { getCommittees } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Subcommittees",
  description: "The teams behind ADVAYA — arts, sports and more.",
};

export default async function SubcommitteePage() {
  const committees = await getCommittees();

  return (
    <>
      <PageHeader
        eyebrow="The Teams"
        title="Subcommittees"
        description="The people who make it all happen, organised by wing."
        breadcrumb={[{ label: "Subcommittee" }]}
      />
      <section className="py-14 sm:py-20">
        <Container>
          {committees.length === 0 ? (
            <EmptyState
              title="No committees added yet."
              icon={<Users className="h-7 w-7" strokeWidth={1.5} />}
            />
          ) : (
            <div className="space-y-16">
              {committees.map((committee) => (
                <Reveal key={committee.id}>
                  <div>
                    <h2 className="text-2xl font-bold text-ink-900">{committee.name}</h2>
                    {committee.description && (
                      <p className="mt-2 max-w-2xl text-ink-500">{committee.description}</p>
                    )}
                    {committee.members.length === 0 ? (
                      <p className="mt-6 text-sm text-ink-400">Members will be listed soon.</p>
                    ) : (
                      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {committee.members.map((m) => (
                          <Card key={m.id} interactive className="p-6 text-center">
                            <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-mesh">
                              {m.photo ? (
                                <Image
                                  src={m.photo}
                                  alt={m.name}
                                  width={80}
                                  height={80}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-purple-400">
                                  {m.name.slice(0, 1)}
                                </div>
                              )}
                            </div>
                            <h3 className="mt-4 font-semibold text-ink-900">{m.name}</h3>
                            {m.position && (
                              <p className="text-sm text-purple-600">{m.position}</p>
                            )}
                            {m.contact && (
                              <a
                                href={`tel:${m.contact}`}
                                className="mt-2 inline-flex items-center gap-1 text-xs text-ink-400 hover:text-purple-600"
                              >
                                <Phone className="h-3 w-3" /> {m.contact}
                              </a>
                            )}
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
