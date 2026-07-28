import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  XIcon,
} from "@/components/ui/social-icons";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/primitives";
import { SITE, NAV_LINKS } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink-900 text-white">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-40" />


      <Container className="relative py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo variant="dark" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              {SITE.description}
            </p>
            <div className="mt-6 flex gap-2">
              <Social href={SITE.socials.instagram} label="Instagram">
                <InstagramIcon className="h-4 w-4" />
              </Social>
              <Social href={SITE.socials.facebook} label="Facebook">
                <FacebookIcon className="h-4 w-4" />
              </Social>
              <Social href={SITE.socials.youtube} label="YouTube">
                <YoutubeIcon className="h-4 w-4" />
              </Social>
              <Social href={SITE.socials.twitter} label="Twitter / X">
                <XIcon className="h-4 w-4" />
              </Social>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Explore
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_LINKS.filter((l) => !("children" in l && l.children)).map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {["UG", "PG", "About Union", "Finance", "Subcommittee"].map((label) => {
                const href =
                  label === "About Union"
                    ? "/about"
                    : `/${label.toLowerCase().replace(" ", "-")}`;
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-white/70 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Contact
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-white/70">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" strokeWidth={1.75} />
                <span>{SITE.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" strokeWidth={1.75} />
                <a href={`tel:${SITE.phone}`} className="hover:text-white">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" strokeWidth={1.75} />
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row">
          <p>
            © {year} {SITE.name} — {SITE.college}. All rights reserved.
          </p>
          <p>
            Developed by{" "}
            <a
              href="https://www.instagram.com/justinkjames.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-purple-300 transition-colors hover:text-purple-200"
            >
              @justinkjames.xyz
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:-translate-y-0.5 hover:border-purple-400/50 hover:bg-purple-500/20 hover:text-white"
    >
      {children}
    </a>
  );
}
