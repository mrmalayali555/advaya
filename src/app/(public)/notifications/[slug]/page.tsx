import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PdfPreviewButton } from "@/components/ui/pdf-preview-button";
import { ExpandableImage } from "@/components/ui/expandable-image";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { getNotification } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const n = await getNotification(slug);
  if (!n) return { title: "Notification not found" };
  return { title: n.title, description: n.description.slice(0, 160) };
}

export default async function NotificationDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const n = await getNotification(slug);
  if (!n) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Notification"
        title={n.title}
        breadcrumb={[
          { label: "Notifications", href: "/notifications" },
          { label: n.title },
        ]}
      />
      <section className="py-14 sm:py-20">
        <Container size="narrow">
          <time className="text-sm text-ink-400">{formatDate(n.date)}</time>

          {n.image && (
            <div className="mt-6">
              <ExpandableImage
                src={n.image}
                alt={n.title}
                caption={n.title}
                aspectRatio="aspect-[16/9]"
                objectFit="contain"
                priority
              />
            </div>
          )}

          <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-ink-600">
            {n.description}
          </div>

          {n.pdfUrl && (
            <div className="mt-8">
              <PdfPreviewButton
                title={n.title}
                pdfUrl={n.pdfUrl}
                label="View Attached Circular (PDF)"
                variant="card"
              />
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
