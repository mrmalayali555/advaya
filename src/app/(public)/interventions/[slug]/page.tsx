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
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all interventions
            </Link>

            <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-[var(--shadow-card)] sm:p-10">
              {/* Header details */}
              <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-ink-100 pb-4 text-sm text-ink-500">
                <span className="flex items-center gap-1.5 font-medium text-ink-700">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  {formattedDate}
                </span>
                {item.category && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-0.5 text-xs font-semibold text-purple-700">
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
                <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-ink-50">
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
              <div className="prose prose-purple max-w-none text-base leading-relaxed text-ink-800 whitespace-pre-wrap">
                {item.description}
              </div>

              {/* PDF Attachment Banner */}
              {item.pdfUrl && (
                <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-purple-100 bg-purple-50/60 p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink-900">Official Document PDF</h4>
                      <p className="text-xs text-ink-500">
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
