"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { DEFAULT_FINANCE_CONFIG, getFinanceConfig } from "@/lib/finance";

function parseDate(value: FormDataEntryValue | null) {
  const raw = String(value || "").trim();
  if (!raw) return undefined;
  const date = new Date(`${raw}T12:00:00`);
  if (Number.isNaN(date.getTime())) throw new Error("Enter a valid date.");
  return date;
}

export async function createFinance(formData: FormData) {
  await requireAdmin();
  const data = {
    kind: String(formData.get("kind") || "income"),
    category: String(formData.get("category") || "").trim() || "General",
    label: String(formData.get("label") || "").trim(),
    amount: Number(formData.get("amount") || 0),
    note: String(formData.get("note") || "").trim() || null,
    receiptUrl: String(formData.get("receiptUrl") || "").trim() || null,
    date: parseDate(formData.get("date")),
    endDate: parseDate(formData.get("endDate")),
  };
  if (!data.label || !Number.isFinite(data.amount) || data.amount <= 0) {
    throw new Error("A label and a positive amount are required.");
  }
  if (data.date && data.endDate && data.endDate < data.date) {
    throw new Error("The end date cannot be earlier than the start date.");
  }
  await db.financeEntry.create({ data });
  revalidatePath("/adminahnuok/finance");
  revalidatePath("/finance");
}

export async function saveFinanceConfig(formData: FormData) {
  await requireAdmin();
  const current = await getFinanceConfig();
  const categories = String(formData.get("categories") || "")
    .split(/\r?\n|,/)
    .map((category) => category.trim())
    .filter(Boolean)
    .filter((category, index, all) => all.indexOf(category) === index);

  const config = {
    ...DEFAULT_FINANCE_CONFIG,
    ...current,
    title: String(formData.get("title") || "").trim() || current.title,
    eyebrow: String(formData.get("eyebrow") || "").trim() || current.eyebrow,
    description: String(formData.get("description") || "").trim() || current.description,
    incomeLabel: String(formData.get("incomeLabel") || "").trim() || current.incomeLabel,
    expenditureLabel: String(formData.get("expenditureLabel") || "").trim() || current.expenditureLabel,
    unionFundLabel: String(formData.get("unionFundLabel") || "").trim() || current.unionFundLabel,
    otherIncomeLabel: String(formData.get("otherIncomeLabel") || "").trim() || current.otherIncomeLabel,
    categories: categories.length > 0 ? categories : current.categories,
  };

  await db.setting.upsert({
    where: { key: "finance_config" },
    update: { value: JSON.stringify(config) },
    create: { key: "finance_config", value: JSON.stringify(config) },
  });
  revalidatePath("/adminahnuok/finance");
  revalidatePath("/finance");
}

export async function deleteFinance(id: string) {
  await requireAdmin();
  await db.financeEntry.delete({ where: { id } });
  revalidatePath("/adminahnuok/finance");
  revalidatePath("/finance");
}
