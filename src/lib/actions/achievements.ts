"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "achievement";
  let slug = root;
  let i = 1;
  while (true) {
    const existing = await db.achievement.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) break;
    slug = `${root}-${i++}`;
  }
  return slug;
}

function parse(formData: FormData) {
  return {
    title: String(formData.get("title") || "").trim(),
    category: String(formData.get("category") || "sports"),
    description: String(formData.get("description") || "").trim(),
    date: new Date(String(formData.get("date") || Date.now())),
    coverImage: String(formData.get("coverImage") || "").trim() || null,
    published: formData.get("published") ? true : false,
  };
}

export async function createAchievement(formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  if (!data.title) return;
  const slug = await uniqueSlug(data.title);
  await db.achievement.create({ data: { ...data, slug } });
  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  revalidatePath("/");
  redirect("/admin/achievements");
}

export async function updateAchievement(id: string, formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  const slug = await uniqueSlug(data.title, id);
  await db.achievement.update({ where: { id }, data: { ...data, slug } });
  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  revalidatePath("/");
  redirect("/admin/achievements");
}

export async function deleteAchievement(id: string) {
  await requireAdmin();
  await db.achievement.delete({ where: { id } });
  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  revalidatePath("/");
  redirect("/admin/achievements");
}
