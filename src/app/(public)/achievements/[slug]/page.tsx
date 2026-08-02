import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Badge } from "@/components/ui/primitives";
import { MediaGallery } from "@/components/cards/media-gallery";
import { ExpandableImage } from "@/components/ui/expandable-image";
import { getAchievement } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await getAchievement(slug);
  if (!a) return { title: "Achievement not found" };
  return {
    title: a.title,
    description: a.description.slice(0, 160),
    openGraph: a.coverImage ? { images: [a.coverImage] } : undefined,
  };
}

export default async function AchievementDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await getAchievement(slug);
  if (!a) notFound();

  return (
    <>
      <PageHeader
        eyebrow={a.category}
        title={a.title}
        breadcrumb={[
          { label: "Achievements", href: "/achievements" },
          { label: a.title },
        ]}
      />
      <section className="py-14 sm:py-20">
        <Container size="narrow">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="purple">{a.category}</Badge>
            <time className="text-sm text-ink-400">{formatDate(a.date)}</time>
          </div>

          {a.coverImage && (
            <div className="mt-6">
              <ExpandableImage
                src={a.coverImage}
                alt={a.title}
                caption={a.title}
                aspectRatio="aspect-[16/9]"
                objectFit="contain"
                priority
              />
            </div>
          )}

          <div className="prose-advaya mt-8 whitespace-pre-line text-lg leading-relaxed text-ink-600">
            {a.description}
          </div>

          {a.media.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-ink-900">Gallery</h2>
              <MediaGallery media={a.media} />
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
