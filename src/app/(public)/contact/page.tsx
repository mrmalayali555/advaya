import { Metadata } from "next";
import { MapPin, Phone, Mail } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Card } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { getSetting } from "@/lib/queries";
import { SITE } from "@/lib/site";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  XIcon,
} from "@/components/ui/social-icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the ADVAYA union — address, phone, email and map.",
};

export default async function ContactPage() {
  const contact = await getSetting("contact", {
    address: SITE.address,
    phone: SITE.phone,
    email: SITE.email,
  });

  return (
    <>
      <PageHeader
        eyebrow="Say Hello"
        title="Contact Us"
        description="Questions, ideas or feedback — we'd love to hear from you."
        breadcrumb={[{ label: "Contact" }]}
      />
      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <div className="space-y-4">
                <InfoCard icon={<MapPin className="h-5 w-5" />} label="Address" value={contact.address} />
                <InfoCard
                  icon={<Phone className="h-5 w-5" />}
                  label="Phone"
                  value={contact.phone}
                  href={`tel:${contact.phone}`}
                />
                <InfoCard
                  icon={<Mail className="h-5 w-5" />}
                  label="Email"
                  value={contact.email}
                  href={`mailto:${contact.email}`}
                />

                <div className="flex gap-2 pt-2">
                  <SocialLink href={SITE.socials.instagram}><InstagramIcon className="h-4 w-4" /></SocialLink>
                  <SocialLink href={SITE.socials.facebook}><FacebookIcon className="h-4 w-4" /></SocialLink>
                  <SocialLink href={SITE.socials.youtube}><YoutubeIcon className="h-4 w-4" /></SocialLink>
                  <SocialLink href={SITE.socials.twitter}><XIcon className="h-4 w-4" /></SocialLink>
                </div>

                <div className="overflow-hidden rounded-3xl border border-ink-100">
                  <iframe
                    src="https://www.google.com/maps/embed?origin=mfe&pb=!1m4!2m1!1sGovt.+T.D.+Medical+College+Vandanam,+Alappuzha,+Kerala,+India!5e0!6i13"
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Alappuzha Medical College location"
                  />
                </div>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}

function InfoCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <Card interactive className="flex items-start gap-4 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-400">{label}</div>
        <div className="mt-0.5 font-medium text-ink-800">{value}</div>
      </div>
    </Card>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}

function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-500 transition-all hover:-translate-y-0.5 hover:border-purple-300 hover:text-purple-600"
    >
      {children}
    </a>
  );
}
