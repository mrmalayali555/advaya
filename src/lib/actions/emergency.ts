"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

function parse(formData: FormData) {
  return {
    category: String(formData.get("category") || "Other").trim(),
    name: String(formData.get("name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    description: String(formData.get("description") || "").trim() || null,
    order: Number(formData.get("order") || 0),
    active: formData.get("active") ? true : false,
  };
}

export async function createEmergency(formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  if (!data.name || !data.phone) return;
  await db.emergencyContact.create({ data });
  revalidatePath("/admin/emergency");
  revalidatePath("/emergency");
}

export async function updateEmergency(id: string, formData: FormData) {
  await requireAdmin();
  await db.emergencyContact.update({ where: { id }, data: parse(formData) });
  revalidatePath("/admin/emergency");
  revalidatePath("/emergency");
  redirect("/admin/emergency");
}

export async function deleteEmergency(id: string) {
  await requireAdmin();
  await db.emergencyContact.delete({ where: { id } });
  revalidatePath("/admin/emergency");
  revalidatePath("/emergency");
}
