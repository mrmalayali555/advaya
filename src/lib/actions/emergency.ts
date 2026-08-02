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
  revalidatePath("/adminahnuok/emergency");
  revalidatePath("/emergency");
}

export async function updateEmergency(id: string, formData: FormData) {
  await requireAdmin();
  await db.emergencyContact.update({ where: { id }, data: parse(formData) });
  revalidatePath("/adminahnuok/emergency");
  revalidatePath("/emergency");
  redirect("/adminahnuok/emergency");
}

export async function moveEmergency(id: string, direction: "up" | "down") {
  await requireAdmin();
  const contacts = await db.emergencyContact.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) return;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= contacts.length) return;

  const current = contacts[index];
  const target = contacts[targetIndex];

  // If their orders are equal or close, normalize sequential order then swap
  let currentNewOrder = target.order;
  let targetNewOrder = current.order;

  if (currentNewOrder === targetNewOrder) {
    if (direction === "up") {
      currentNewOrder = Math.max(0, target.order - 1);
    } else {
      currentNewOrder = target.order + 1;
    }
  }

  await db.emergencyContact.update({
    where: { id: current.id },
    data: { order: currentNewOrder },
  });
  await db.emergencyContact.update({
    where: { id: target.id },
    data: { order: targetNewOrder },
  });

  revalidatePath("/adminahnuok/emergency");
  revalidatePath("/emergency");
}

export async function setEmergencyOrder(id: string, order: number) {
  await requireAdmin();
  await db.emergencyContact.update({
    where: { id },
    data: { order },
  });
  revalidatePath("/adminahnuok/emergency");
  revalidatePath("/emergency");
}

export async function deleteEmergency(id: string) {
  await requireAdmin();
  await db.emergencyContact.delete({ where: { id } });
  revalidatePath("/adminahnuok/emergency");
  revalidatePath("/emergency");
}

export async function updateEmergencyPdf(url: string, name: string) {
  await requireAdmin();
  const value = JSON.stringify({ url, name, updatedAt: new Date().toISOString() });
  await db.setting.upsert({
    where: { key: "emergency_registry_pdf" },
    update: { value },
    create: { key: "emergency_registry_pdf", value },
  });
  revalidatePath("/adminahnuok/emergency");
  revalidatePath("/emergency");
}

export async function deleteEmergencyPdf() {
  await requireAdmin();
  const value = JSON.stringify({ deleted: true, updatedAt: new Date().toISOString() });
  await db.setting.upsert({
    where: { key: "emergency_registry_pdf" },
    update: { value },
    create: { key: "emergency_registry_pdf", value },
  });
  revalidatePath("/adminahnuok/emergency");
  revalidatePath("/emergency");
}




