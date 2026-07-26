"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "committee";
  let slug = root;
  let i = 1;
  while (true) {
    const existing = await db.committee.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) break;
    slug = `${root}-${i++}`;
  }
  return slug;
}

export async function createCommittee(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  await db.committee.create({
    data: {
      name,
      slug: await uniqueSlug(name),
      description: String(formData.get("description") || "").trim() || null,
      order: Number(formData.get("order") || 0),
    },
  });
  revalidatePath("/adminahnuok/committees");
  revalidatePath("/subcommittee");
}

export async function updateCommittee(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  await db.committee.update({
    where: { id },
    data: {
      name,
      slug: await uniqueSlug(name, id),
      description: String(formData.get("description") || "").trim() || null,
      order: Number(formData.get("order") || 0),
    },
  });
  revalidatePath("/adminahnuok/committees");
  revalidatePath("/subcommittee");
  redirect("/adminahnuok/committees");
}

export async function deleteCommittee(id: string) {
  await requireAdmin();
  await db.committee.delete({ where: { id } });
  revalidatePath("/adminahnuok/committees");
  revalidatePath("/subcommittee");
  redirect("/adminahnuok/committees");
}

export async function addMember(committeeId: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  await db.committeeMember.create({
    data: {
      committeeId,
      name,
      position: String(formData.get("position") || "").trim() || null,
      contact: String(formData.get("contact") || "").trim() || null,
      photo: String(formData.get("photo") || "").trim() || null,
      order: Number(formData.get("order") || 0),
    },
  });
  revalidatePath("/adminahnuok/committees");
  revalidatePath("/subcommittee");
}

export async function deleteMember(id: string) {
  await requireAdmin();
  await db.committeeMember.delete({ where: { id } });
  revalidatePath("/adminahnuok/committees");
  revalidatePath("/subcommittee");
}

