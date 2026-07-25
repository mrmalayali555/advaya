import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { EventCard } from "@/components/cards/content-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { getEvents } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past events organised by the ADVAYA union.",
};

const TABS = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Past" },
];

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await searchParams;
  const events = await getEvents({ status });

  return (
    <>
      <PageHeader
        eyebrow="What's Happening"
        title="Events"
        description="From cultural nights to blood donation camps — here's everything the union has planned."
        breadcrumb={[{ label: "Events" }]}
      />
      <section className="py-14 sm:py-20">
        <Container>
          <Reveal>
            <div className="flex flex-wrap gap-2">
              {TABS.map((t) => (
                <Link
                  key={t.key}
                  href={t.key === "all" ? "/events" : `/events?status=${t.key}`}
                  className={cn(
                    "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                    status === t.key
                      ? "bg-purple-600 text-white shadow-[0_8px_20px_-8px_rgba(91,42,134,0.6)]"
                      : "border border-ink-200 bg-white text-ink-600 hover:border-purple-300 hover:text-purple-700"
                  )}
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </Reveal>

          {events.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                title="No events to show."
                description="New events will appear here as soon as they're announced."
                icon={<CalendarDays className="h-7 w-7" strokeWidth={1.5} />}
              />
            </div>
          ) : (
            <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
