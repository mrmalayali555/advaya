"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function createFinance(formData: FormData) {
  await requireAdmin();
  const data = {
    kind: String(formData.get("kind") || "income"),
    category: String(formData.get("category") || "").trim() || "General",
    label: String(formData.get("label") || "").trim(),
    amount: Number(formData.get("amount") || 0),
    note: String(formData.get("note") || "").trim() || null,
    receiptUrl: String(formData.get("receiptUrl") || "").trim() || null,
  };
  if (!data.label || !data.amount) return;
  await db.financeEntry.create({ data });
  revalidatePath("/adminahnuok/finance");
  revalidatePath("/finance");
}

export async function deleteFinance(id: string) {
  await requireAdmin();
  await db.financeEntry.delete({ where: { id } });
  revalidatePath("/adminahnuok/finance");
  revalidatePath("/finance");
}

