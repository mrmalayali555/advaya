import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date as e.g. "15 Oct 2026". */
export function formatDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format a date range.
 * - Same day → "15 Oct 2026"
 * - Same month & year → "20–28 Feb 2028"
 * - Same year, different months → "20 Feb – 5 Mar 2028"
 * - Different years → "28 Dec 2027 – 3 Jan 2028"
 */
export function formatDateRange(
  start: string | Date,
  end?: string | Date | null,
): string {
  const s = typeof start === "string" ? new Date(start) : start;
  if (!end) return formatDate(s);
  const e = typeof end === "string" ? new Date(end) : end;
  if (Number.isNaN(e.getTime())) return formatDate(s);

  const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" };
  const startYear = s.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", year: "numeric" });
  const endYear   = e.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", year: "numeric" });
  const startMonth = s.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", month: "short" });
  const endMonth   = e.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", month: "short" });
  const startDay   = s.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit" });
  const endDay     = e.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit" });

  if (startYear === endYear && startMonth === endMonth) {
    // e.g. "20–28 Feb 2028"
    return `${startDay}–${endDay} ${endMonth} ${endYear}`;
  }
  if (startYear === endYear) {
    // e.g. "20 Feb – 5 Mar 2028"
    return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${endYear}`;
  }
  // e.g. "28 Dec 2027 – 3 Jan 2028"
  return `${s.toLocaleDateString("en-IN", opts)} – ${e.toLocaleDateString("en-IN", opts)}`;
}

/** Format a date and time as e.g. "15 Oct 2026, 02:30 PM". */
export function formatDateTime(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Relative time, e.g. "3 days ago". */
export function timeAgo(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  return formatDate(d);
}

/** URL-safe slug from a title. */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Truncate to n chars on a word boundary. */
export function truncate(text: string, n = 140): string {
  if (text.length <= n) return text;
  return text.slice(0, text.lastIndexOf(" ", n)).trimEnd() + "…";
}
