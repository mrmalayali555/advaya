import { PageHeader } from "@/components/layout/page-header";
import { getFinanceData } from "@/lib/finance";
import { FinanceDashboard } from "@/components/finance/finance-dashboard";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const { entries, config } = await getFinanceData();
  return (
    <>
      <PageHeader eyebrow={config.eyebrow} title={config.title} description={config.description} breadcrumb={[{ label: config.title }]} />
      <FinanceDashboard
        config={config}
        entries={entries.map((entry) => ({
          id: entry.id,
          kind: entry.kind === "expenditure" ? "expenditure" : "income",
          category: entry.category,
          label: entry.label,
          amount: entry.amount,
          note: entry.note,
          date: entry.date.toISOString(),
        }))}
      />
    </>
  );
}
