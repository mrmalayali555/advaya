import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import type { PageSection, PageSettings, SectionType } from "@/lib/page-builder-types";
import {
  RichTextSection,
  ButtonSection,
  NoticeBoardSection,
  FileDownloadsSection,
  FaqSection,
  PeopleSection,
  StatsSection,
  LinksSection,
  VideoSection,
  QuoteSection,
  DividerSection,
  ScheduleSection,
  CountdownSection,
  ContactSection,
  TimelineSection,
  DutyRosterSection,
  GallerySection,
  QuickActionsSection,
  AnnouncementSection,
} from "./public-sections";

// Map section type to its renderer component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sectionRenderers: Record<SectionType, React.ComponentType<{ data: any }>> = {
  "rich-text": RichTextSection,
  button: ButtonSection,
  "notice-board": NoticeBoardSection,
  "file-downloads": FileDownloadsSection,
  faq: FaqSection,
  people: PeopleSection,
  stats: StatsSection,
  links: LinksSection,
  video: VideoSection,
  quote: QuoteSection,
  divider: DividerSection,
  schedule: ScheduleSection,
  countdown: CountdownSection,
  contact: ContactSection,
  timeline: TimelineSection,
  "duty-roster": DutyRosterSection,
  gallery: GallerySection,
  "quick-actions": QuickActionsSection,
  announcement: AnnouncementSection,
};

interface PageRendererProps {
  sections: PageSection[];
  settings?: PageSettings;
}

export function PageRenderer({ sections }: PageRendererProps) {
  // Only render visible sections and sort by order
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  if (visibleSections.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {visibleSections.map((section) => {
        const Renderer = sectionRenderers[section.type];
        if (!Renderer) return null;

        // Determine spacing
        const spacingClass = 
          section.spacing === "compact" ? "py-4 sm:py-6" :
          section.spacing === "spacious" ? "py-16 sm:py-24" :
          "py-8 sm:py-12";

        // Determine background
        const bgClass =
          section.background === "glass" ? "bg-surface-container/50 backdrop-blur-md border-y border-white/5" :
          section.background === "subtle" ? "bg-surface-container-low" :
          section.background === "gradient" ? "bg-gradient-to-b from-surface-container-high/40 to-transparent" :
          "bg-transparent";

        // Handle full-width exceptions like divider/announcement where we don't always want standard padding
        const isDivider = section.type === "divider";
        const isAnnouncement = section.type === "announcement";

        return (
          <section
            key={section.id}
            id={section.id}
            className={cn(
              "w-full",
              !isDivider && !isAnnouncement && spacingClass,
              bgClass
            )}
          >
            <Container size={section.width === "normal" ? "default" : (section.width || "default")}>
              <Reveal delay={0.1}>
                {/* Render section title and subtitle if present */}
                {(section.title || section.subtitle) && (
                  <div className="mb-8 flex flex-col items-center text-center sm:mb-12">
                    {section.title && (
                      <h2 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl md:text-[2.75rem] leading-[1.1]">
                        {section.title}
                      </h2>
                    )}
                    {section.subtitle && (
                      <p className="mt-4 max-w-2xl text-lg text-on-surface-variant">
                        {section.subtitle}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Render the actual section content */}
                <Renderer data={section.data} />
              </Reveal>
            </Container>
          </section>
        );
      })}
    </div>
  );
}
