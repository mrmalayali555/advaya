import "server-only";

import { db } from "@/lib/db";

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

export async function getFinanceConfig(): Promise<FinanceConfig> {
  const setting = await db.setting.findUnique({ where: { key: "finance_config" } });
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
  const [entries, config] = await Promise.all([
    db.financeEntry.findMany({ orderBy: [{ date: "desc" }, { createdAt: "desc" }] }),
    getFinanceConfig(),
  ]);
  return { entries, config };
}
