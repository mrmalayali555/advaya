// ──────────────────────────────────────────────────────────────────────────────
// Page Builder — Section types, data shapes, and utilities
// ──────────────────────────────────────────────────────────────────────────────

import { nanoid } from "nanoid"; // already in deps via next

/* ─── Section Type Enum ─── */
export const SECTION_TYPES = [
  "rich-text",
  "button",
  "notice-board",
  "file-downloads",
  "faq",
  "people",
  "stats",
  "links",
  "video",
  "quote",
  "divider",
  "schedule",
  "countdown",
  "contact",
  "timeline",
  "duty-roster",
  "gallery",
  "quick-actions",
  "announcement",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

/* ─── Individual data shapes per section type ─── */

export interface RichTextData {
  html: string;
}

export interface ButtonItem {
  id: string;
  label: string;
  url: string;
  style: "primary" | "secondary" | "outline" | "ghost";
  icon?: string; // lucide icon name
  openInNewTab: boolean;
}
export interface ButtonData {
  buttons: ButtonItem[];
  alignment: "left" | "center" | "right";
}

export interface NoticeItem {
  id: string;
  title: string;
  body: string;
  date: string; // ISO string
  priority: "urgent" | "new" | "info" | "pinned";
  expiryDate?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}
export interface NoticeBoardData {
  notices: NoticeItem[];
}

export interface FileItem {
  id: string;
  name: string;
  url: string;
  category: string; // Syllabus, Timetable, Circular, Form, Other
  description?: string;
  size?: string;
}
export interface FileDownloadsData {
  files: FileItem[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
export interface FaqData {
  items: FaqItem[];
}

export interface PersonItem {
  id: string;
  name: string;
  role: string;
  group?: string; // Class Representatives, Faculty Advisors, etc.
  phone?: string;
  email?: string;
  photoUrl?: string;
}
export interface PeopleData {
  people: PersonItem[];
  layout: "grid" | "list";
}

export interface StatItem {
  id: string;
  label: string;
  value: string; // "120+" or "15"
  icon?: string;
}
export interface StatsData {
  items: StatItem[];
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
}
export interface LinksData {
  links: LinkItem[];
}

export interface VideoData {
  url: string; // YouTube or Vimeo URL
  title?: string;
  description?: string;
}

export interface QuoteData {
  text: string;
  author: string;
  role?: string;
}

export interface DividerData {
  style: "line" | "dotted" | "space" | "gradient";
}

export interface ScheduleSlot {
  time: string;
  content: string;
}
export interface ScheduleDay {
  day: string;
  slots: ScheduleSlot[];
}
export interface ScheduleData {
  days: ScheduleDay[];
  caption?: string;
}

export interface CountdownData {
  targetDate: string; // ISO
  label: string;
  description?: string;
  hideAfterExpiry: boolean;
}

export interface ContactData {
  phone?: string;
  email?: string;
  location?: string;
  hours?: string;
  whatsapp?: string;
}

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description?: string;
}
export interface TimelineData {
  items: TimelineItem[];
}

export interface DutyRosterShift {
  time: string;
  names: string;
}
export interface DutyRosterDay {
  day: string;
  shifts: DutyRosterShift[];
}
export interface DutyRosterData {
  days: DutyRosterDay[];
  contacts: { name: string; phone: string }[];
}

export interface GalleryImageItem {
  id: string;
  url: string;
  caption?: string;
}
export interface GalleryData {
  images: GalleryImageItem[];
  layout: "grid" | "masonry" | "carousel";
  columns: number;
}

export interface QuickActionItem {
  id: string;
  label: string;
  url: string;
  icon: string;
  color?: string;
}
export interface QuickActionsData {
  actions: QuickActionItem[];
}

export interface AnnouncementData {
  text: string;
  type: "info" | "warning" | "success" | "urgent";
  dismissible: boolean;
  linkUrl?: string;
  linkText?: string;
}

/* ─── Type map ─── */
export type SectionDataMap = {
  "rich-text": RichTextData;
  button: ButtonData;
  "notice-board": NoticeBoardData;
  "file-downloads": FileDownloadsData;
  faq: FaqData;
  people: PeopleData;
  stats: StatsData;
  links: LinksData;
  video: VideoData;
  quote: QuoteData;
  divider: DividerData;
  schedule: ScheduleData;
  countdown: CountdownData;
  contact: ContactData;
  timeline: TimelineData;
  "duty-roster": DutyRosterData;
  gallery: GalleryData;
  "quick-actions": QuickActionsData;
  announcement: AnnouncementData;
};

/* ─── Section wrapper ─── */
export interface PageSection<T extends SectionType = SectionType> {
  id: string;
  type: T;
  order: number;
  visible: boolean;
  title?: string;
  subtitle?: string;
  background?: "transparent" | "glass" | "subtle" | "gradient";
  width?: "narrow" | "normal" | "wide";
  spacing?: "compact" | "normal" | "spacious";
  data: SectionDataMap[T];
}

/* ─── Page-level settings ─── */
export interface PageSettings {
  eyebrow?: string;
  icon?: string;
  themeColor?: string;
  bannerImageUrl?: string;
  metaDescription?: string;
  showLastUpdated?: boolean;
  isDraft?: boolean;
}

/* ─── Full page content (stored as JSON in Page.content) ─── */
export interface PageContent {
  intro?: string; // backwards compat
  settings?: PageSettings;
  sections: PageSection[];
}

/* ─── Section metadata for the picker UI ─── */
export interface SectionMeta {
  type: SectionType;
  label: string;
  description: string;
  icon: string; // lucide icon name
  category: "content" | "media" | "data" | "layout" | "interactive";
}

export const SECTION_META: SectionMeta[] = [
  { type: "rich-text", label: "Rich Text", description: "Formatted text with headings, lists, and links", icon: "FileText", category: "content" },
  { type: "button", label: "Button / CTA", description: "Clickable buttons with custom links — link to PDFs, pages, or any URL", icon: "MousePointerClick", category: "interactive" },
  { type: "notice-board", label: "Notice Board", description: "Announcements with priority badges and expiry dates", icon: "Bell", category: "content" },
  { type: "file-downloads", label: "File Downloads", description: "Upload and share PDFs, syllabi, timetables, circulars", icon: "Download", category: "media" },
  { type: "faq", label: "FAQ", description: "Expandable Q&A accordion", icon: "HelpCircle", category: "content" },
  { type: "people", label: "People Directory", description: "Cards with name, role, phone, email, photo", icon: "Users", category: "data" },
  { type: "stats", label: "Stats / Counters", description: "Animated number counters with labels", icon: "BarChart3", category: "data" },
  { type: "links", label: "Links Collection", description: "Curated list of important URLs", icon: "Link", category: "content" },
  { type: "video", label: "Video Embed", description: "Embed YouTube or Vimeo videos", icon: "Play", category: "media" },
  { type: "quote", label: "Quote / Testimonial", description: "Highlighted quote with attribution", icon: "Quote", category: "content" },
  { type: "divider", label: "Divider / Spacer", description: "Visual separator between sections", icon: "Minus", category: "layout" },
  { type: "schedule", label: "Schedule / Timetable", description: "Day-wise or week-wise timetable grid", icon: "Calendar", category: "data" },
  { type: "countdown", label: "Countdown Timer", description: "Animated countdown to an important date", icon: "Timer", category: "interactive" },
  { type: "contact", label: "Contact Card", description: "Phone, email, location with tap-to-call", icon: "Phone", category: "data" },
  { type: "timeline", label: "Timeline", description: "Vertical timeline for milestones and deadlines", icon: "GitBranch", category: "data" },
  { type: "duty-roster", label: "Duty Roster", description: "Shift-based roster with days and contacts", icon: "Shield", category: "data" },
  { type: "gallery", label: "Image Gallery", description: "Photo grid with captions", icon: "Image", category: "media" },
  { type: "quick-actions", label: "Quick Actions", description: "Sticky row of icon buttons for common actions", icon: "Zap", category: "interactive" },
  { type: "announcement", label: "Announcement Banner", description: "Colored banner for urgent announcements", icon: "Megaphone", category: "interactive" },
];

/* ─── Factory: create a new empty section ─── */
export function createEmptySection<T extends SectionType>(type: T, order: number): PageSection<T> {
  const defaults: Record<SectionType, unknown> = {
    "rich-text": { html: "" } satisfies RichTextData,
    button: { buttons: [{ id: nanoid(6), label: "Click Here", url: "", style: "primary", openInNewTab: false }], alignment: "center" } satisfies ButtonData,
    "notice-board": { notices: [] } satisfies NoticeBoardData,
    "file-downloads": { files: [] } satisfies FileDownloadsData,
    faq: { items: [] } satisfies FaqData,
    people: { people: [], layout: "grid" } satisfies PeopleData,
    stats: { items: [] } satisfies StatsData,
    links: { links: [] } satisfies LinksData,
    video: { url: "", title: "" } satisfies VideoData,
    quote: { text: "", author: "" } satisfies QuoteData,
    divider: { style: "line" } satisfies DividerData,
    schedule: { days: [], caption: "" } satisfies ScheduleData,
    countdown: { targetDate: new Date(Date.now() + 7 * 86400000).toISOString(), label: "Coming Soon", hideAfterExpiry: true } satisfies CountdownData,
    contact: {} satisfies ContactData,
    timeline: { items: [] } satisfies TimelineData,
    "duty-roster": { days: [], contacts: [] } satisfies DutyRosterData,
    gallery: { images: [], layout: "grid", columns: 3 } satisfies GalleryData,
    "quick-actions": { actions: [] } satisfies QuickActionsData,
    announcement: { text: "", type: "info", dismissible: true } satisfies AnnouncementData,
  };

  return {
    id: nanoid(8),
    type,
    order,
    visible: true,
    data: defaults[type] as SectionDataMap[T],
  };
}

/* ─── Parse stored JSON safely ─── */
export function parsePageContent(raw: string | null | undefined): PageContent {
  if (!raw) return { sections: [] };
  try {
    const parsed = JSON.parse(raw);
    // If it's the old format (just { intro: "..." }), convert
    if (!parsed.sections) {
      return {
        intro: parsed.intro,
        settings: {},
        sections: [],
      };
    }
    return parsed as PageContent;
  } catch {
    return { sections: [] };
  }
}
