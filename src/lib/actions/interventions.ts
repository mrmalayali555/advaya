"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/require-admin";

export async function createIntervention(formData: FormData) {
  await requireAdmin();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const dateStr = formData.get("date") as string;
  const image = (formData.get("image") as string) || null;
  const pdfUrl = (formData.get("pdfUrl") as string) || null;
  const category = (formData.get("category") as string)?.trim() || null;
  const published = formData.get("published") === "on";
  const pinned = formData.get("pinned") === "on";

  if (!title || !description) {
    throw new Error("Title and description are required.");
  }

  let slug = slugify(title);
  // Ensure unique slug
  const existing = await db.intervention.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const date = dateStr ? new Date(dateStr) : new Date();

  await db.intervention.create({
    data: {
      title,
      slug,
      description,
      date,
      image,
      pdfUrl,
      category,
      published,
      pinned,
    },
  });

  revalidatePath("/interventions");
  revalidatePath("/adminahnuok/interventions");
  redirect("/adminahnuok/interventions");
}

export async function updateIntervention(id: string, formData: FormData) {
  await requireAdmin();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const dateStr = formData.get("date") as string;
  const image = (formData.get("image") as string) || null;
  const pdfUrl = (formData.get("pdfUrl") as string) || null;
  const category = (formData.get("category") as string)?.trim() || null;
  const published = formData.get("published") === "on";
  const pinned = formData.get("pinned") === "on";

  if (!title || !description) {
    throw new Error("Title and description are required.");
  }

  const date = dateStr ? new Date(dateStr) : new Date();

  await db.intervention.update({
    where: { id },
    data: {
      title,
      description,
      date,
      image,
      pdfUrl,
      category,
      published,
      pinned,
    },
  });

  revalidatePath("/interventions");
  revalidatePath("/adminahnuok/interventions");
  revalidatePath(`/adminahnuok/interventions/${id}`);
  redirect("/adminahnuok/interventions");
}

export async function deleteIntervention(id: string) {
  await requireAdmin();
  await db.intervention.delete({ where: { id } });
  revalidatePath("/interventions");
  revalidatePath("/adminahnuok/interventions");
  redirect("/adminahnuok/interventions");
}

export async function togglePublishIntervention(id: string, currentStatus: boolean) {
  await requireAdmin();
  await db.intervention.update({
    where: { id },
    data: { published: !currentStatus },
  });
  revalidatePath("/interventions");
  revalidatePath("/adminahnuok/interventions");
}

export async function togglePinIntervention(id: string, currentPinned: boolean) {
  await requireAdmin();
  await db.intervention.update({
    where: { id },
    data: { pinned: !currentPinned },
  });
  revalidatePath("/interventions");
  revalidatePath("/adminahnuok/interventions");
}


