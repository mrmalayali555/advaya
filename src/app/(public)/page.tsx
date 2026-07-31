import Link from "next/link";
import { ArrowUpRight, Phone, Siren, Target, Eye, Quote } from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { EventTicket } from "@/components/sections/event-ticket";
import { Container, SectionHeading, Card } from "@/components/ui/primitives";
import AppleInvites from "@/components/ui/apple-invites";
import { FanEvents } from "@/components/ui/fan-events";
import { EditableText } from "@/components/admin/visual-editor";
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
  const [hero, stats, notifications, achievements, events, emergency, about, marquee, carouselInterval] =
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
      getSetting("carousel_interval", { value: 4000 }),
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
            <h2 className="text-3xl font-bold text-on-surface mb-8">Quick Access</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {QUICK_LINKS.map((q) => (
              <RevealItem key={q.href}>
                <Link
                  href={q.href}
                  className="glass-card group flex h-full flex-col justify-between rounded-3xl p-6 transition-all duration-500 ease-brand hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(221,183,255,0.15)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center text-secondary">
                      <Icon name={q.icon} className="h-6 w-6" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-on-surface-variant transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
                  </div>
                  <div className="mt-8">
                    <span className="font-semibold text-on-surface">{q.label}</span>
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
            <AppleInvites achievements={achievements} interval={carouselInterval.value} />
          </Reveal>
        </Container>
      </section>

      {/* Upcoming events */}
      {events.length > 0 && (
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
      )}

      {/* About preview */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHeading
                eyebrow={
                  <EditableText type="page" keyName="about" field="eyebrow_home">
                    {aboutData.eyebrow_home || "About ADVAYA"}
                  </EditableText>
                }
                title={
                  <EditableText type="page" keyName="about" field="title_home">
                    {aboutData.title_home || "More than a union — a student voice."}
                  </EditableText>
                }
                description={
                  <EditableText type="page" keyName="about" field="history">
                    {aboutData.history}
                  </EditableText>
                }
              />
              <div className="mt-8 space-y-5">
                <ValueRow 
                  icon={<Target className="h-5 w-5" />} 
                  title={<EditableText type="page" keyName="about" field="mission_title">{aboutData.mission_title || "Mission"}</EditableText>} 
                  text={<EditableText type="page" keyName="about" field="mission">{aboutData.mission}</EditableText>} 
                />
                <ValueRow 
                  icon={<Eye className="h-5 w-5" />} 
                  title={<EditableText type="page" keyName="about" field="vision_title">{aboutData.vision_title || "Vision"}</EditableText>} 
                  text={<EditableText type="page" keyName="about" field="vision">{aboutData.vision}</EditableText>} 
                />
              </div>
              <div className="mt-8">
                <ButtonLink href="/about" arrow>Learn more</ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <Card className="overflow-hidden">
                <div className="relative flex flex-col items-start justify-center p-8 sm:p-10 min-h-[340px] bg-gradient-to-br from-surface-container-high to-surface-container">
                  <Quote className="h-10 w-10 text-purple-400 mb-4 opacity-50" />
                  <p className="max-w-sm text-base sm:text-lg font-medium leading-relaxed text-on-surface italic">
                    &ldquo;
                    <EditableText type="page" keyName="about" field="chairperson">
                      {aboutData.chairperson}
                    </EditableText>
                    &rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-px w-8 bg-purple-500/50" />
                    <p className="text-sm font-semibold text-purple-300">
                      <EditableText type="page" keyName="about" field="chairperson_title">
                        {aboutData.chairperson_title || "Message from the Chairperson"}
                      </EditableText>
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
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-high px-8 py-16 text-center sm:px-12">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
              <div className="relative">
                <SectionHeading
                  align="center"
                  eyebrow="Get in touch"
                  title={
                    <EditableText type="setting" keyName="contact_cta" field="title">
                      Have something to say?
                    </EditableText>
                  }
                  description={
                    <EditableText type="setting" keyName="contact_cta" field="description">
                      Whether it&apos;s a concern, an idea, or a suggestion — the union is listening.
                    </EditableText>
                  }
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
  title: React.ReactNode;
  text?: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-900/30 text-purple-400">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-on-surface">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{text}</p>
      </div>
    </div>
  );
}
