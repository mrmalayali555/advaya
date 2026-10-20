"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import type { PageContent } from "@/lib/page-builder-types";
import {
  DEFAULT_MAINTENANCE_SETTINGS,
  isMaintenanceAnimation,
  parseMaintenanceSettings,
} from "@/lib/maintenance-settings";

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
  const contentLayout = {
    events: Math.min(3, Math.max(1, Number(formData.get("layout_events") || 1))),
    achievements: Math.min(3, Math.max(1, Number(formData.get("layout_achievements") || 1))),
    interventions: Math.min(3, Math.max(1, Number(formData.get("layout_interventions") || 1))),
  };

  await Promise.all([
    saveSetting("hero", hero),
    saveSetting("contact", contact),
    saveSetting("stats", stats),
    saveSetting("carousel_interval", carouselInterval),
    saveSetting("complaints", complaints),
    saveSetting("nav_search", navSearch),
    saveSetting("content_layout", contentLayout),
  ]);
}

export async function saveMaintenanceMode(formData: FormData) {
  await requireAdmin();

  const enabled = formData.get("maintenance_mode") === "on";
  const animation = String(formData.get("maintenance_animation") || "");
  const current = await db.setting.findUnique({ where: { key: "maintenance_mode" } });
  const existing = parseMaintenanceSettings(current?.value);
  const settings = {
    ...DEFAULT_MAINTENANCE_SETTINGS,
    ...existing,
    enabled,
    eyebrow: String(formData.get("maintenance_eyebrow") || "").trim().slice(0, 120),
    title: String(formData.get("maintenance_title") || "").trim().slice(0, 160),
    message: String(formData.get("maintenance_message") || "").trim().slice(0, 500),
    status: String(formData.get("maintenance_status") || "").trim().slice(0, 80),
    footer: String(formData.get("maintenance_footer") || "").trim().slice(0, 120),
    animation: isMaintenanceAnimation(animation) ? animation : existing.animation,
  };

  if (!settings.eyebrow || !settings.title || !settings.message || !settings.status || !settings.footer) {
    throw new Error("Maintenance copy cannot be empty.");
  }

  await db.setting.upsert({
    where: { key: "maintenance_mode" },
    update: { value: JSON.stringify(settings) },
    create: { key: "maintenance_mode", value: JSON.stringify(settings) },
  });

  revalidatePath("/adminahnuok/settings");
  revalidatePath("/maintenance");
  redirect(
    formData.get("maintenance_return") === "site"
      ? "/maintenance"
      : `/adminahnuok/settings?maintenance_saved=${enabled ? "enabled" : "disabled"}`
  );
}
