import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Download, FileText } from "lucide-react";
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
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl border border-ink-100">
              <Image
                src={n.image}
                alt={n.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-ink-600">
            {n.description}
          </div>

          {n.pdfUrl && (
            <a
              href={n.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-purple-600 px-6 py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-purple-700"
            >
              <FileText className="h-5 w-5" />
              Download attached PDF
              <Download className="h-4 w-4" />
            </a>
          )}
        </Container>
      </section>
    </>
  );
}
