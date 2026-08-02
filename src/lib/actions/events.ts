"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "event";
  let slug = root;
  let i = 1;
  // Ensure uniqueness against other rows.
  while (true) {
    const existing = await db.event.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) break;
    slug = `${root}-${i++}`;
  }
  return slug;
}

function parse(formData: FormData) {
  const endDateRaw = String(formData.get("endDate") || "").trim();
  let committeeIds: string[] = [];
  try {
    const rawIds = formData.get("committeeIds") as string;
    if (rawIds) {
      const parsed = JSON.parse(rawIds);
      if (Array.isArray(parsed)) {
        committeeIds = parsed.filter((id) => typeof id === "string" && id.trim().length > 0);
      }
    }
  } catch (e) {}

  const committeeIdRaw = String(formData.get("committeeId") || "").trim();
  if (committeeIds.length === 0 && committeeIdRaw) {
    committeeIds = [committeeIdRaw];
  }

  return {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    date: new Date(String(formData.get("date") || Date.now())),
    endDate: endDateRaw ? new Date(endDateRaw) : null,
    time: String(formData.get("time") || "").trim() || null,
    venue: String(formData.get("venue") || "").trim() || null,
    poster: String(formData.get("poster") || "").trim() || null,
    status: String(formData.get("status") || "upcoming"),
    published: formData.get("published") ? true : false,
    committeeId: committeeIds.length > 0 ? committeeIds[0] : null,
    committeeIds,
  };
}

export async function createEvent(formData: FormData) {
  await requireAdmin();
  const { committeeIds, ...data } = parse(formData);
  if (!data.title) return;
  const slug = await uniqueSlug(data.title);
  await db.event.create({
    data: {
      ...data,
      slug,
      committees: {
        connect: committeeIds.map((id) => ({ id })),
      },
    },
  });
  revalidatePath("/adminahnuok/events");
  revalidatePath("/events");
  revalidatePath("/");
  redirect("/adminahnuok/events");
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAdmin();
  const { committeeIds, ...data } = parse(formData);
  const slug = await uniqueSlug(data.title, id);
  await db.event.update({
    where: { id },
    data: {
      ...data,
      slug,
      committees: {
        set: committeeIds.map((id) => ({ id })),
      },
    },
  });
  revalidatePath("/adminahnuok/events");
  revalidatePath("/events");
  revalidatePath(`/events/${slug}`);
  revalidatePath("/");
  redirect("/adminahnuok/events");
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  await db.event.delete({ where: { id } });
  revalidatePath("/adminahnuok/events");
  revalidatePath("/events");
  revalidatePath("/");
  redirect("/adminahnuok/events");
}

