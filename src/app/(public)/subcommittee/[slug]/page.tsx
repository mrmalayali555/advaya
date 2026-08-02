import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone, Users, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Card } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { EventCard } from "@/components/cards/content-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { getCommittee, getCommitteeEvents } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const committee = await getCommittee(slug);
  if (!committee) return { title: "Committee Not Found" };
  return {
    title: `${committee.name} — Subcommittee`,
    description: committee.description || `${committee.name} subcommittee of ADVAYA union.`,
  };
}

export default async function SubcommitteeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const committee = await getCommittee(slug);
  if (!committee) notFound();

  const events = await getCommitteeEvents(committee.id);

  return (
    <>
      <PageHeader
        eyebrow="Subcommittee"
        title={committee.name}
        description={committee.description || "ADVAYA Union Subcommittee"}
        breadcrumb={[
          { label: "Subcommittee", href: "/subcommittee" },
          { label: committee.name },
        ]}
      />

      {/* Members Section */}
      <section className="py-10 sm:py-16">
        <Container>
          <Reveal>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Members</h2>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  {committee.members.length} {committee.members.length === 1 ? "member" : "members"}
                </p>
              </div>
            </div>
          </Reveal>

          {committee.members.length === 0 ? (
            <EmptyState
              title="Members will be listed soon."
              icon={<Users className="h-7 w-7" strokeWidth={1.5} />}
            />
          ) : (
            <RevealGroup className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              {committee.members.map((m) => (
                <RevealItem key={m.id}>
                  <Card interactive className="glass-card p-4 sm:p-6 text-center">
                    <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      {m.photo ? (
                        <Image
                          src={m.photo}
                          alt={m.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg sm:text-xl font-bold text-white/60">
                          {m.name.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <h3 className="mt-3 sm:mt-4 text-sm sm:text-base font-semibold text-white truncate">{m.name}</h3>
                    {m.position && (
                      <p className="text-xs sm:text-sm text-purple-300 truncate">{m.position}</p>
                    )}
                    {m.contact && (
                      <a
                        href={`tel:${m.contact}`}
                        className="mt-1.5 sm:mt-2 inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-white/60 hover:text-purple-300 transition-colors"
                      >
                        <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {m.contact}
                      </a>
                    )}
                  </Card>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </Container>
      </section>

      {/* Events by this Committee */}
      <section className="border-t border-white/5 py-10 sm:py-16">
        <Container>
          <Reveal>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Events</h2>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Events organized by {committee.name}
                </p>
              </div>
            </div>
          </Reveal>

          {events.length === 0 ? (
            <EmptyState
              title="No events yet."
              description={`Events organized by ${committee.name} will appear here.`}
              icon={<CalendarDays className="h-7 w-7" strokeWidth={1.5} />}
            />
          ) : (
            <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <RevealItem key={e.id}>
                  <EventCard event={e} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </Container>
      </section>
    </>
  );
}
