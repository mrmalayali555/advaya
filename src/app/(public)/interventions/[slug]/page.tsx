import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Calendar, Tag, Pin } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { getIntervention } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getIntervention(slug);
  if (!item) return { title: "Intervention Not Found" };
  return {
    title: item.title,
    description: item.description,
  };
}

export default async function InterventionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getIntervention(slug);

  if (!item || !item.published) {
    notFound();
  }

  const formattedDate = formatDate(item.date);

  return (
    <>
      <PageHeader
        eyebrow="Official Intervention"
        title={item.title}
        description={item.category || "Alappuzha Medical College Union"}
        breadcrumb={[
          { label: "Interventions", href: "/interventions" },
          { label: item.title },
        ]}
      />

      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/interventions"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all interventions
            </Link>

            <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
              {/* Header details */}
              <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-white/10 pb-4 text-sm text-white/80">
                <span className="flex items-center gap-1.5 font-medium text-on-surface-variant">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  {formattedDate}
                </span>
                {item.category && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-900/30 border border-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-300">
                    <Tag className="h-3 w-3" /> {item.category}
                  </span>
                )}
                {item.pinned && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-600 px-3 py-0.5 text-xs font-semibold text-white">
                    <Pin className="h-3 w-3 fill-current" /> Pinned Notice
                  </span>
                )}
              </div>

              {/* Cover Image */}
              {item.image && (
                <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-white/5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              )}

              {/* Main Text */}
              <div className="prose prose-invert max-w-none text-base leading-relaxed text-on-surface-variant whitespace-pre-wrap">
                {item.description}
              </div>

              {/* PDF Attachment Banner */}
              {item.pdfUrl && (
                <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-purple-500/20 bg-purple-900/20 p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">Official Document PDF</h4>
                      <p className="text-xs text-on-surface-variant">
                        View or download the official letter / representation document.
                      </p>
                    </div>
                  </div>

                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-purple-700"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
