"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import type { PageContent } from "@/lib/page-builder-types";

/** Save a rich page's JSON content (about / ug / pg). */
export async function savePage(key: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") || "").trim();

  let content: Record<string, string> = {};
  if (key === "about") {
    content = {
      history: String(formData.get("history") || "").trim(),
      mission: String(formData.get("mission") || "").trim(),
      vision: String(formData.get("vision") || "").trim(),
      chairperson: String(formData.get("chairperson") || "").trim(),
    };
  } else {
    content = { intro: String(formData.get("intro") || "").trim() };
  }

  await db.page.upsert({
    where: { key },
    update: { title, content: JSON.stringify(content) },
    create: { key, title, content: JSON.stringify(content) },
  });

  revalidatePath("/adminahnuok/pages");
  revalidatePath(`/${key === "about" ? "about" : key}`);
  revalidatePath("/");
}

/** Save page builder sections (ug / pg). Full JSON content with sections array. */
export async function savePageSections(key: string, title: string, content: PageContent) {
  await requireAdmin();

  await db.page.upsert({
    where: { key },
    update: { title, content: JSON.stringify(content) },
    create: { key, title, content: JSON.stringify(content) },
  });

  revalidatePath("/adminahnuok/pages");
  revalidatePath(`/${key}`);
  revalidatePath("/");
}

/** Save a key-value setting (hero, contact, stats, socials). */
export async function saveSetting(key: string, value: Record<string, unknown>) {
  await requireAdmin();
  await db.setting.upsert({
    where: { key },
    update: { value: JSON.stringify(value) },
    create: { key, value: JSON.stringify(value) },
  });
  revalidatePath("/", "layout");
  revalidatePath("/adminahnuok/settings");
}

export async function saveSettingsForm(formData: FormData) {
  await requireAdmin();

  const hero = {
    badge: String(formData.get("hero_badge") || "").trim(),
    title: String(formData.get("hero_title") || "").trim(),
    subtitle: String(formData.get("hero_subtitle") || "").trim(),
  };
  const contact = {
    address: String(formData.get("contact_address") || "").trim(),
    phone: String(formData.get("contact_phone") || "").trim(),
    email: String(formData.get("contact_email") || "").trim(),
  };
  const stats = {
    students: Number(formData.get("stats_students") || 0),
    events: Number(formData.get("stats_events") || 0),
    achievements: Number(formData.get("stats_achievements") || 0),
    committees: Number(formData.get("stats_committees") || 0),
  };
  const carouselInterval = {
    value: Math.max(1, Number(formData.get("carousel_interval") || 4)) * 1000
  };
  const complaints = {
    showIcons: formData.get("complaints_show_icons") === "on",
    f1_title: String(formData.get("c_f1_title") || "").trim(),
    f1_text: String(formData.get("c_f1_text") || "").trim(),
    f2_title: String(formData.get("c_f2_title") || "").trim(),
    f2_text: String(formData.get("c_f2_text") || "").trim(),
    f3_title: String(formData.get("c_f3_title") || "").trim(),
    f3_text: String(formData.get("c_f3_text") || "").trim(),
  };
  const navSearch = {
    showMobile: formData.get("search_show_mobile") === "on",
    showDesktop: formData.get("search_show_desktop") === "on",
  };

  await Promise.all([
    saveSetting("hero", hero),
    saveSetting("contact", contact),
    saveSetting("stats", stats),
    saveSetting("carousel_interval", carouselInterval),
    saveSetting("complaints", complaints),
    saveSetting("nav_search", navSearch),
  ]);
}

