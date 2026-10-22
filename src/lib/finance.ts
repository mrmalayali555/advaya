import "server-only";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const DEFAULT_FINANCE_CONFIG = {
  title: "Union Accounts",
  eyebrow: "Financial transparency",
  description: "A clear view of income received and expenditure made by the college union.",
  incomeLabel: "Income",
  expenditureLabel: "Expenditure",
  unionFundLabel: "Union Fund",
  otherIncomeLabel: "Other Income",
  categories: ["Union Fund", "Sponsorship", "Coupon Sale"],
  allowPdfExport: true,
  showGraph: true,
};

export type FinanceConfig = typeof DEFAULT_FINANCE_CONFIG;

async function getFinanceEntries() {
  try {
    return await db.financeEntry.findMany({
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("Finance schema is missing a newer optional column; using the legacy read-only query.", error);
    try {
      return await db.$queryRaw<
        Array<{
          id: string;
          kind: string;
          category: string;
          label: string;
          amount: number;
          note: string | null;
          receiptUrl: string | null;
          date: Date | null;
          endDate: Date | null;
          createdAt: Date;
        }>
      >(Prisma.sql`
        SELECT "id", "kind", "category", "label", "amount", "note", "receiptUrl",
               "date", NULL::timestamp AS "endDate", "createdAt"
        FROM "FinanceEntry"
        ORDER BY "date" DESC NULLS LAST, "createdAt" DESC
      `);
    } catch (fallbackError) {
      console.error("Unable to load finance entries; showing an empty account history.", fallbackError);
      return [];
    }
  }
}

export async function getFinanceConfig(): Promise<FinanceConfig> {
  let setting;
  try {
    setting = await db.setting.findUnique({ where: { key: "finance_config" } });
  } catch (error) {
    console.error("Unable to load finance settings; using defaults.", error);
    return DEFAULT_FINANCE_CONFIG;
  }
  if (!setting) return DEFAULT_FINANCE_CONFIG;

  try {
    const parsed = JSON.parse(setting.value) as Partial<FinanceConfig>;
    return {
      ...DEFAULT_FINANCE_CONFIG,
      ...parsed,
      categories: Array.isArray(parsed.categories) && parsed.categories.length > 0
        ? parsed.categories.filter((category): category is string => typeof category === "string" && category.trim().length > 0)
        : DEFAULT_FINANCE_CONFIG.categories,
      allowPdfExport: parsed.allowPdfExport !== false,
      showGraph: parsed.showGraph !== false,
    };
  } catch {
    return DEFAULT_FINANCE_CONFIG;
  }
}

export async function getFinanceData() {
  const [entries, config] = await Promise.all([getFinanceEntries(), getFinanceConfig()]);
  return { entries, config };
}
