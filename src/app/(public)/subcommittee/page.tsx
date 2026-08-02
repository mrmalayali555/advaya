import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Users, Phone, ArrowRight } from "lucide-react";
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
      <section className="py-10 sm:py-20">
        <Container>
          {committees.length === 0 ? (
            <EmptyState
              title="No committees added yet."
              icon={<Users className="h-7 w-7" strokeWidth={1.5} />}
            />
          ) : (
            <div className="space-y-12 sm:space-y-16">
              {committees.map((committee) => (
                <Reveal key={committee.id}>
                  <div className="glass-card rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-8 backdrop-blur-xl">
                    {/* Committee Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-2xl font-bold text-on-surface">{committee.name}</h2>
                          {committee.description && (
                            <p className="mt-0.5 text-xs sm:text-sm text-on-surface-variant line-clamp-2 max-w-lg">{committee.description}</p>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/subcommittee/${committee.slug}`}
                        className="inline-flex items-center gap-1.5 self-start rounded-full bg-purple-600/20 border border-purple-500/20 px-4 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-600/30 transition-colors"
                      >
                        View Details <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    {/* Members Preview */}
                    {committee.members.length === 0 ? (
                      <p className="text-sm text-on-surface-variant">Members will be listed soon.</p>
                    ) : (
                      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                        {committee.members.slice(0, 8).map((m) => (
                          <div key={m.id} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/5 p-3 sm:p-4 transition-colors hover:border-white/10">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                              {m.photo ? (
                                <Image
                                  src={m.photo}
                                  alt={m.name}
                                  width={48}
                                  height={48}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-sm sm:text-base font-bold text-white/50">
                                  {m.name.slice(0, 1)}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{m.name}</h3>
                              {m.position && (
                                <p className="text-[10px] sm:text-xs text-purple-300 truncate">{m.position}</p>
                              )}
                            </div>
                          </div>
                        ))}
                        {committee.members.length > 8 && (
                          <Link
                            href={`/subcommittee/${committee.slug}`}
                            className="flex items-center justify-center rounded-xl bg-white/5 border border-white/5 p-3 sm:p-4 text-xs font-semibold text-purple-400 hover:bg-white/10 transition-colors"
                          >
                            +{committee.members.length - 8} more
                          </Link>
                        )}
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
