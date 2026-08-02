import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Pin } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { PdfPreviewButton } from "@/components/ui/pdf-preview-button";
import { ExpandableImage } from "@/components/ui/expandable-image";
import { getIntervention } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getIntervention(slug);
  if (!item) return { title: "Intervention Not Found" };

  const title = `${item.title} · ADVAYA TDMC Alappuzha`;
  const description = item.description.slice(0, 160);
  const url = `${SITE.url}/interventions/${slug}`;
  const images = item.image ? [{ url: item.image }] : [{ url: "/og.png" }];

  return {
    title,
    description,
    keywords: [
      item.title,
      "Advaya Interventions",
      "ADVAYA TDMC Alappuzha",
      "Government TD Medical College Alappuzha",
      "TDMC Alappuzha Union",
      item.category || "Student Representation",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: "article",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: item.image ? [item.image] : ["/og.png"],
    },
    alternates: {
      canonical: url,
    },
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

      <section className="py-6 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/interventions"
              className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all interventions
            </Link>

            <div className="glass-card rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
              {/* Header details */}
              <div className="mb-6 flex flex-wrap items-center gap-2.5 sm:gap-3 border-b border-white/10 pb-4 text-xs sm:text-sm text-white/80">
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

              {/* Cover Image with Lightbox Zoom */}
              {item.image && (
                <div className="mb-6 sm:mb-8">
                  <ExpandableImage
                    src={item.image}
                    alt={item.title}
                    caption={item.title}
                    priority
                    aspectRatio="aspect-[16/9]"
                    objectFit="contain"
                  />
                </div>
              )}

              {/* Main Text */}
              <div className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed text-on-surface-variant whitespace-pre-wrap">
                {item.description}
              </div>

              {/* PDF Attachment Banner */}
              {item.pdfUrl && (
                <div className="mt-6 sm:mt-8">
                  <PdfPreviewButton
                    title={item.title}
                    pdfUrl={item.pdfUrl}
                    label="View Official Document (PDF)"
                    variant="card"
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
