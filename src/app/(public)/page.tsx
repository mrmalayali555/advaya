import Link from "next/link";
import { ArrowUpRight, Phone, Siren, Target, Eye, Heart } from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { EventTicket } from "@/components/sections/event-ticket";
import { HeartButton } from "@/components/ui/heart-button";
import { Container, SectionHeading, Card } from "@/components/ui/primitives";
import AppleInvites from "@/components/ui/apple-invites";
import { FanEvents } from "@/components/ui/fan-events";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import {
  AchievementCard,
  EventCard,
  NotificationRow,
} from "@/components/cards/content-cards";
import { QUICK_LINKS, SITE } from "@/lib/site";
import {
  getSetting,
  getNotifications,
  getAchievements,
  getUpcomingEvents,
  getEmergencyContacts,
  getPage,
  getMarquee,
} from "@/lib/queries";

export default async function HomePage() {
  const [hero, stats, notifications, achievements, events, emergency, about, marquee] =
    await Promise.all([
      getSetting("hero", {
        badge: SITE.college,
        title: "The voice of every student.",
        subtitle: SITE.description,
      }),
      getSetting("stats", {
        students: 1200,
        events: 48,
        achievements: 96,
        committees: 12,
      }),
      getNotifications(4),
      getAchievements({ take: 3 }),
      getUpcomingEvents(3),
      getEmergencyContacts(),
      getPage("about"),
      getMarquee(),
    ]);

  const aboutData = (about?.data ?? {}) as Record<string, string>;

  return (
    <>
      <Hero
        badge={hero.badge}
        title={hero.title}
        subtitle={hero.subtitle}
        stats={stats}
        marquee={marquee}
      />

      {/* Quick links */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Quick Access"
              title="Everything, one tap away"
              description="Jump straight to what students need most."
            />
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {QUICK_LINKS.map((q) => (
              <RevealItem key={q.href}>
                <Link
                  href={q.href}
                  className="group flex h-full flex-col justify-between rounded-3xl border border-ink-100 bg-white p-6 shadow-[var(--shadow-soft)] transition-all duration-500 ease-brand hover:-translate-y-1 hover:border-purple-200 hover:shadow-[var(--shadow-card)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                    <Icon name={q.icon} className="h-6 w-6" />
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="font-semibold text-ink-900">{q.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-purple-600" />
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Featured upcoming event — the ticket */}
      {events.length > 0 && (
        <section className="relative overflow-hidden bg-ink-900 py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-mesh opacity-30" />
          <div className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-purple-600/25 blur-[120px]" />
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <div className="text-white">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-purple-200">
                    Next Up
                  </span>
                  <h2 className="mt-5 text-3xl font-bold leading-[1.1] sm:text-4xl md:text-[2.75rem]">
                    Your pass to what&apos;s{" "}
                    <span className="bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent">
                      coming next.
                    </span>
                  </h2>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-white/60">
                    The moment the union announces an event, it lands right here — grab
                    the details and mark your calendar.
                  </p>
                  <div className="mt-8">
                    <ButtonLink href="/events" variant="secondary" arrow>
                      See all events
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={1}>
                <div className="flex justify-center lg:justify-end">
                  <EventTicket event={events[0]} />
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      )}

      {/* Notifications */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Latest Updates"
                title="Notifications"
                description="Official notices, straight from the union."
              />
              <ButtonLink href="/notifications" variant="outline" size="sm" arrow>
                View all
              </ButtonLink>
            </div>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-4 md:grid-cols-2">
            {notifications.map((n) => (
              <RevealItem key={n.id}>
                <NotificationRow notification={n} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Achievements */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Proud Moments"
                title="Recent Achievements"
                description="Our students, shining across sports, arts and academics."
              />
              <ButtonLink href="/achievements" variant="outline" size="sm" arrow>
                View all
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal className="mt-10">
            <AppleInvites achievements={achievements} />
          </Reveal>
        </Container>
      </section>

      {/* Upcoming events */}
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="What's Next"
                title="Upcoming Events"
                description="Mark your calendar — here's what's coming up."
              />
              <ButtonLink href="/events" variant="outline" size="sm" arrow>
                View all
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal className="mt-10">
            <FanEvents events={events} />
          </Reveal>
        </Container>
      </section>

      {/* About preview */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHeading
                eyebrow="About ADVAYA"
                title={<>More than a union — <span className="text-gradient">a family.</span></>}
                description={aboutData.history}
              />
              <div className="mt-8 space-y-5">
                <ValueRow icon={<Target className="h-5 w-5" />} title="Mission" text={aboutData.mission} />
                <ValueRow icon={<Eye className="h-5 w-5" />} title="Vision" text={aboutData.vision} />
              </div>
              <div className="mt-8">
                <ButtonLink href="/about" arrow>Learn more</ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <Card className="overflow-hidden">
                <div className="relative aspect-[4/3] bg-mesh">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <HeartButton />
                    <p className="mt-5 max-w-sm text-lg font-medium leading-relaxed text-ink-700">
                      &ldquo;{aboutData.chairperson}&rdquo;
                    </p>
                    <p className="mt-4 text-sm font-semibold text-purple-700">
                      — Message from the Chairperson
                    </p>
                  </div>
                </div>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Emergency strip */}
      <section className="py-8">
        <Container>
          <Reveal>
            <div className="overflow-hidden rounded-3xl bg-ink-900 p-8 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 text-red-300">
                    <Siren className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Emergency Contacts</h3>
                    <p className="text-sm text-white/60">Save these. Share them. They save lives.</p>
                  </div>
                </div>
                <ButtonLink href="/emergency" variant="secondary" arrow>
                  Full registry
                </ButtonLink>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {emergency.slice(0, 6).map((c) => (
                  <a
                    key={c.id}
                    href={`tel:${c.phone}`}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition-colors hover:bg-white/10"
                  >
                    <div>
                      <div className="text-xs uppercase tracking-wider text-purple-300">{c.category}</div>
                      <div className="text-sm font-medium text-white">{c.name}</div>
                    </div>
                    <span className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Phone className="h-4 w-4" /> {c.phone}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-purple-50 px-8 py-16 text-center sm:px-12">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-300/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-400/15 blur-3xl" />
              <div className="relative">
                <SectionHeading
                  align="center"
                  eyebrow="Get in touch"
                  title="Have something to say?"
                  description="Whether it's a concern, an idea, or a suggestion — the union is listening."
                />
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <ButtonLink href="/complaints" size="lg" arrow>Drop your suggestion</ButtonLink>
                  <ButtonLink href="/contact" size="lg" variant="outline">Contact us</ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

function ValueRow({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text?: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-ink-900">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-ink-500">{text}</p>
      </div>
    </div>
  );
}
