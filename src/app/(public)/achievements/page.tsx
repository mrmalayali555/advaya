import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { AchievementCard } from "@/components/cards/content-cards";
import { getAchievements } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Achievements",
  description:
    "Celebrating our students' achievements across sports, arts and academics at Alappuzha Medical College.",
};

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "sports", label: "Sports" },
  { key: "arts", label: "Arts" },
  { key: "academics", label: "Academics" },
];

export default async function AchievementsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = "all" } = await searchParams;
  const achievements = await getAchievements({ category });

  return (
    <>
      <PageHeader
        eyebrow="Proud Moments"
        title="Achievements"
        description="Our students, shining across sports, arts and academics."
        breadcrumb={[{ label: "Achievements" }]}
      />

      <section className="py-14 sm:py-20">
        <Container>
          <Reveal>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.key}
                  href={c.key === "all" ? "/achievements" : `/achievements?category=${c.key}`}
                  className={cn(
                    "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                    category === c.key
                      ? "bg-purple-600 text-white shadow-[0_8px_20px_-8px_rgba(91,42,134,0.6)]"
                      : "glass-card text-white/70 hover:border-purple-400 hover:text-purple-300"
                  )}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </Reveal>

          {achievements.length === 0 ? (
            <EmptyState />
          ) : (
            <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((a) => (
                <RevealItem key={a.id}>
                  <AchievementCard achievement={a} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </Container>
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 glass-card rounded-3xl border-dashed py-20 text-center">
      <p className="text-lg font-medium text-on-surface">No achievements here yet.</p>
      <p className="mt-1 text-sm text-on-surface-variant">Check back soon — great things are coming.</p>
    </div>
  );
}
