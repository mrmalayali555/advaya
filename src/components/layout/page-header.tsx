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
    <section className="relative overflow-hidden border-b border-white/5 bg-[#050208] pt-28 pb-14 sm:pt-36 sm:pb-16">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-70" />
      <div className="pointer-events-none absolute -right-24 -top-10 h-72 w-72 rounded-full bg-purple-300/20 blur-[100px]" />
      <Container className="relative">
        <Reveal>
          {breadcrumb && (
            <nav className="mb-5 flex items-center gap-1.5 text-sm text-white/50">
              <Link href="/" className="hover:text-purple-400">
                Home
              </Link>
              {breadcrumb.map((b) => (
                <span key={b.label} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5" />
                  {b.href ? (
                    <Link href={b.href} className="hover:text-purple-400">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-white/70">{b.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-on-surface sm:text-5xl">
            <EditableText type="page" keyName={pageKey} field="title">
              {title}
            </EditableText>
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
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
