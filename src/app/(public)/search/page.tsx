import { Metadata } from "next";
import Link from "next/link";
import {
  Trophy,
  CalendarDays,
  Bell,
  ArrowUpRight,
  Globe,
  HeartHandshake,
  Phone,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Card } from "@/components/ui/primitives";
import { SearchBox } from "@/components/forms/search-box";
import { EmptyState } from "@/components/ui/empty-state";
import { searchAll } from "@/lib/queries";
import { formatDate, formatDateRange } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Search",
  description: "Search across achievements, events and notifications.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await searchAll(q) : null;
  const total = results
    ? results.pages.length +
      results.events.length +
      results.interventions.length +
      results.emergencyContacts.length +
      results.subcommittees.length +
      results.achievements.length +
      results.notifications.length
    : 0;

  return (
    <>
      <PageHeader eyebrow="Find Anything" title="Search" breadcrumb={[{ label: "Search" }]} />
      <section className="py-14 sm:py-20">
        <Container size="narrow">
          <SearchBox initial={q} />

          {q && (
            <p className="mt-6 text-sm text-ink-400">
              {total} result{total === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
            </p>
          )}

          {results && total === 0 && (
            <div className="mt-8">
              <EmptyState
                title="No matches found."
                description="Try a different keyword."
              />
            </div>
          )}

          {results && total > 0 && (
            <div className="mt-8 space-y-3">
              {results.pages.map((p) => (
                <ResultRow
                  key={p.href}
                  href={p.href}
                  icon={<Globe className="h-4 w-4" />}
                  kind="Website Page"
                  title={p.title}
                  meta={p.description}
                />
              ))}
              {results.events.map((e) => (
                <ResultRow
                  key={e.id}
                  href={`/events/${e.slug}`}
                  icon={<CalendarDays className="h-4 w-4" />}
                  kind="Event"
                  title={e.title}
                  meta={formatDateRange(e.date, e.endDate)}
                />
              ))}
              {results.interventions.map((i) => (
                <ResultRow
                  key={i.id}
                  href={`/interventions/${i.slug}`}
                  icon={<HeartHandshake className="h-4 w-4" />}
                  kind="Social Intervention"
                  title={i.title}
                  meta={formatDate(i.date)}
                />
              ))}
              {results.emergencyContacts.map((c) => (
                <ResultRow
                  key={c.id}
                  href="/emergency"
                  icon={<Phone className="h-4 w-4" />}
                  kind={c.category || "Emergency Directory"}
                  title={c.name}
                  meta={c.phone}
                />
              ))}
              {results.subcommittees.map((s) => (
                <ResultRow
                  key={s.id}
                  href={`/subcommittee/${s.slug}`}
                  icon={<Users className="h-4 w-4" />}
                  kind="Subcommittee"
                  title={s.name}
                  meta="Organizing Committee"
                />
              ))}
              {results.achievements.map((a) => (
                <ResultRow
                  key={a.id}
                  href={`/achievements/${a.slug}`}
                  icon={<Trophy className="h-4 w-4" />}
                  kind="Achievement"
                  title={a.title}
                  meta={formatDate(a.date)}
                />
              ))}
              {results.notifications.map((n) => (
                <ResultRow
                  key={n.id}
                  href={`/notifications/${n.slug}`}
                  icon={<Bell className="h-4 w-4" />}
                  kind="Notification"
                  title={n.title}
                  meta={formatDate(n.date)}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

function ResultRow({
  href,
  icon,
  kind,
  title,
  meta,
}: {
  href: string;
  icon: React.ReactNode;
  kind: string;
  title: string;
  meta: string;
}) {
  return (
    <Link href={href}>
      <Card interactive className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wider text-purple-500">{kind}</div>
          <div className="truncate font-semibold text-ink-900">{title}</div>
        </div>
        <span className="hidden text-sm text-ink-400 sm:block">{meta}</span>
        <ArrowUpRight className="h-4 w-4 text-ink-300" />
      </Card>
    </Link>
  );
}
