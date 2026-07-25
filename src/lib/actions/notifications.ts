"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "notice";
  let slug = root;
  let i = 1;
  while (true) {
    const existing = await db.notification.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) break;
    slug = `${root}-${i++}`;
  }
  return slug;
}

function parse(formData: FormData) {
  return {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    date: new Date(String(formData.get("date") || Date.now())),
    image: String(formData.get("image") || "").trim() || null,
    pdfUrl: String(formData.get("pdfUrl") || "").trim() || null,
    published: formData.get("published") ? true : false,
  };
}

export async function createNotification(formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  if (!data.title) return;
  const slug = await uniqueSlug(data.title);
  await db.notification.create({ data: { ...data, slug } });
  revalidatePath("/admin/notifications");
  revalidatePath("/notifications");
  revalidatePath("/");
  redirect("/admin/notifications");
}

export async function updateNotification(id: string, formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  const slug = await uniqueSlug(data.title, id);
  await db.notification.update({ where: { id }, data: { ...data, slug } });
  revalidatePath("/admin/notifications");
  revalidatePath("/notifications");
  revalidatePath("/");
  redirect("/admin/notifications");
}

export async function deleteNotification(id: string) {
  await requireAdmin();
  await db.notification.delete({ where: { id } });
  revalidatePath("/admin/notifications");
  revalidatePath("/notifications");
  revalidatePath("/");
  redirect("/admin/notifications");
}
