import { Container, Eyebrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EditableText } from "@/components/admin/visual-editor";

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  const pageKey = breadcrumb?.[0]?.label?.toLowerCase() || "page";

  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-[#050208] pt-28 pb-8 sm:pt-36 sm:pb-16">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-70" />
      <div className="pointer-events-none absolute -right-24 -top-10 h-72 w-72 rounded-full bg-purple-300/20 blur-[100px]" />
      <Container className="relative">
        <Reveal>
          {breadcrumb && (
            <nav className="mb-3 sm:mb-5 flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-white/50">
              <Link href="/" className="hover:text-purple-400">
                Home
              </Link>
              {breadcrumb.map((b) => (
                <span key={b.label} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white/30" />
                  {b.href ? (
                    <Link href={b.href} className="hover:text-purple-400">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-white/70 max-w-[220px] sm:max-w-none truncate">{b.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="mt-2 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-on-surface">
            <EditableText type="page" keyName={pageKey} field="title">
              {title}
            </EditableText>
          </h1>
          {description && (
            <p className="mt-2.5 sm:mt-4 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-on-surface-variant">
              <EditableText type="page" keyName={pageKey} field="intro">
                {description}
              </EditableText>
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
