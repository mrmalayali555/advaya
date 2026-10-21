"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, CalendarDays, Landmark, TrendingUp } from "lucide-react";

type Entry = {
  id: string;
  kind: "income" | "expenditure";
  category: string;
  label: string;
  amount: number;
  note: string | null;
  date: string;
};

type Config = {
  title: string;
  eyebrow: string;
  description: string;
  incomeLabel: string;
  expenditureLabel: string;
  unionFundLabel: string;
  otherIncomeLabel: string;
};

function money(value: number) {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function FinanceDashboard({
  entries,
  config,
}: {
  entries: Entry[];
  config: Config;
}) {
  const reducedMotion = useReducedMotion();
  const [kind, setKind] = useState<"all" | "income" | "expenditure">("all");
  const [category, setCategory] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(entries.map((entry) => entry.category))).sort(),
    [entries]
  );
  const filtered = useMemo(() => entries.filter((entry) => {
    const date = entry.date.slice(0, 10);
    return (
      (kind === "all" || entry.kind === kind) &&
      (category === "all" || entry.category === category) &&
      (!from || date >= from) &&
      (!to || date <= to)
    );
  }), [entries, kind, category, from, to]);
  const income = filtered.filter((entry) => entry.kind === "income").reduce((sum, entry) => sum + entry.amount, 0);
  const expenditure = filtered.filter((entry) => entry.kind === "expenditure").reduce((sum, entry) => sum + entry.amount, 0);
  const balance = income - expenditure;
  const maxAmount = Math.max(...filtered.map((entry) => entry.amount), 1);
  const categorySnapshots = useMemo(() => categories.map((name) => {
    const categoryEntries = filtered.filter((entry) => entry.category === name);
    const categoryIncome = categoryEntries.filter((entry) => entry.kind === "income").reduce((sum, entry) => sum + entry.amount, 0);
    const categoryExpenditure = categoryEntries.filter((entry) => entry.kind === "expenditure").reduce((sum, entry) => sum + entry.amount, 0);
    const latest = categoryEntries[0]?.date;
    return { name, balance: categoryIncome - categoryExpenditure, latest };
  }), [categories, filtered]);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label={config.incomeLabel} amount={income} tone="income" icon={ArrowUpRight} reducedMotion={reducedMotion} />
        <SummaryCard label={config.expenditureLabel} amount={expenditure} tone="expense" icon={ArrowDownRight} reducedMotion={reducedMotion} />
        <SummaryCard label="Current balance" amount={balance} tone="balance" icon={Landmark} reducedMotion={reducedMotion} />
      </div>
      {categorySnapshots.length > 0 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {categorySnapshots.map((snapshot) => (
            <div key={snapshot.name} className="min-w-[190px] flex-1 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
              <div className="truncate text-xs text-white/45">{snapshot.name}</div>
              <div className={`mt-1 text-lg font-semibold ${snapshot.balance >= 0 ? "text-white/85" : "text-rose-300"}`}>{money(snapshot.balance)}</div>
              <div className="mt-1 text-[11px] text-white/35">{snapshot.latest ? `Updated ${formatDate(snapshot.latest)}` : "No entries yet"}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[var(--shadow-card)] sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <TrendingUp className="h-4 w-4 text-purple-300" /> Transaction flow
              </div>
              <p className="mt-1 text-xs text-white/45">Every recorded entry, with the largest movements highlighted.</p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">{filtered.length} entries</span>
          </div>
          <div className="mt-6 space-y-3">
            {filtered.length === 0 ? <p className="py-12 text-center text-sm text-white/45">No entries match these filters.</p> : (
              filtered.slice(0, 8).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={reducedMotion ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reducedMotion ? 0 : index * 0.035 }}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(110px,0.7fr)_auto] items-center gap-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-white/85">{entry.label}</div>
                    <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-white/40">
                      <span>{entry.category}</span><span>{formatDate(entry.date)}</span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max((entry.amount / maxAmount) * 100, 4)}%` }}
                      transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : index * 0.035 }}
                      className={`h-full rounded-full ${entry.kind === "income" ? "bg-emerald-400" : "bg-rose-400"}`}
                    />
                  </div>
                  <span className={`text-right text-sm font-semibold ${entry.kind === "income" ? "text-emerald-300" : "text-rose-300"}`}>
                    {entry.kind === "income" ? "+" : "−"}{money(entry.amount)}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[var(--shadow-card)] sm:p-7">
          <div className="flex items-center gap-2 text-sm font-semibold text-white"><CalendarDays className="h-4 w-4 text-purple-300" /> Account history</div>
          <p className="mt-1 text-xs text-white/45">Filter the public record by type, category, or date range.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <FilterSelect label="View" value={kind} onChange={(value) => setKind(value as typeof kind)} options={[["all", "All entries"], ["income", config.incomeLabel], ["expenditure", config.expenditureLabel]]} />
            <FilterSelect label="Category" value={category} onChange={setCategory} options={[["all", "All categories"], ...categories.map((value) => [value, value])]} />
            <label className="text-xs text-white/50">From<input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="mt-1 block w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white [color-scheme:dark]" /></label>
            <label className="text-xs text-white/50">To<input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="mt-1 block w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white [color-scheme:dark]" /></label>
          </div>
          <div className="mt-6 max-h-[360px] space-y-2 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {filtered.map((entry) => (
                <motion.div key={entry.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-2xl border border-white/8 bg-black/15 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><p className="truncate text-sm text-white/80">{entry.label}</p><p className="mt-1 text-xs text-white/35">{entry.category} · {formatDate(entry.date)}</p></div>
                    <strong className={`shrink-0 text-sm ${entry.kind === "income" ? "text-emerald-300" : "text-rose-300"}`}>{entry.kind === "income" ? "+" : "−"}{money(entry.amount)}</strong>
                  </div>
                  {entry.note && <p className="mt-2 text-xs leading-relaxed text-white/45">{entry.note}</p>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ label, amount, tone, icon: Icon, reducedMotion }: { label: string; amount: number; tone: "income" | "expense" | "balance"; icon: typeof Landmark; reducedMotion: boolean | null }) {
  const color = tone === "income" ? "text-emerald-300" : tone === "expense" ? "text-rose-300" : amount >= 0 ? "text-purple-200" : "text-rose-300";
  return <motion.div initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5 shadow-[var(--shadow-card)]"><div className="flex items-center justify-between text-xs text-white/45"><span>{label}</span><Icon className={`h-4 w-4 ${color}`} /></div><div className={`mt-3 text-2xl font-bold tracking-tight ${color}`}>{money(amount)}</div></motion.div>;
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) {
  return <label className="text-xs text-white/50">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 block w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white">{options.map(([option, text]) => <option key={option} value={option}>{text}</option>)}</select></label>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
}
