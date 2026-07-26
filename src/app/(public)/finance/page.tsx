import { Metadata } from "next";
import { TrendingUp, TrendingDown, Wallet, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Card } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { getFinance } from "@/lib/queries";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Finance",
  description: "Transparent income and expenditure of the ADVAYA union.",
};

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default async function FinancePage() {
  const { income, expenditure, totalIncome, totalExpenditure, balance } =
    await getFinance();

  return (
    <>
      <PageHeader
        eyebrow="Transparency"
        title="Finance"
        description="Where the money comes from, and where it goes. Openly."
        breadcrumb={[{ label: "Finance" }]}
      />
      <section className="py-14 sm:py-20">
        <Container>
          <Reveal>
            <FinanceCard
              totalIncome={totalIncome}
              totalExpenditure={totalExpenditure}
              balance={balance}
            />
          </Reveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <LedgerTable title="Income" entries={income} accent="emerald" />
            <LedgerTable title="Expenditure" entries={expenditure} accent="red" />
          </div>
        </Container>
      </section>
    </>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  tone,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: string;
  bg: string;
}) {
  return (
    <Card className="p-6">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ${tone}`}>
        {icon}
      </div>
      <div className="mt-5 text-sm font-medium text-ink-500">{label}</div>
      <div className={`mt-1 text-3xl font-bold ${tone}`}>{value}</div>
    </Card>
  );
}

function LedgerTable({
  title,
  entries,
  accent,
}: {
  title: string;
  entries: {
    id: string;
    category: string;
    label: string;
    amount: number;
    date: Date;
    receiptUrl: string | null;
  }[];
  accent: "emerald" | "red";
}) {
  return (
    <Reveal>
      <Card className="overflow-hidden">
        <div className="border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-bold text-ink-900">{title}</h2>
        </div>
        {entries.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink-400">
            No {title.toLowerCase()} recorded yet.
          </p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-ink-800">{e.label}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-400">
                    <span className="rounded-full bg-ink-100 px-2 py-0.5">{e.category}</span>
                    <span>{formatDate(e.date)}</span>
                    {e.receiptUrl && (
                      <a
                        href={e.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-purple-600 hover:underline"
                      >
                        <FileText className="h-3 w-3" /> receipt
                      </a>
                    )}
                  </div>
                </div>
                <div
                  className={`shrink-0 text-sm font-bold ${
                    accent === "emerald" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {accent === "emerald" ? "+" : "−"}₹{e.amount.toLocaleString("en-IN")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Reveal>
  );
}
