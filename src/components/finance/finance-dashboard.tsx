"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, CalendarDays, Download, Landmark } from "lucide-react";

type Entry = {
  id: string;
  kind: "income" | "expenditure";
  category: string;
  label: string;
  amount: number;
  note: string | null;
  date: string;
  endDate: string | null;
};

type Config = {
  title: string;
  eyebrow: string;
  description: string;
  incomeLabel: string;
  expenditureLabel: string;
  unionFundLabel: string;
  otherIncomeLabel: string;
  allowPdfExport: boolean;
  showGraph: boolean;
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
    const start = entry.date.slice(0, 10);
    const end = (entry.endDate || entry.date).slice(0, 10);
    return (
      (kind === "all" || entry.kind === kind) &&
      (category === "all" || entry.category === category) &&
      (!from || end >= from) &&
      (!to || start <= to)
    );
  }), [entries, kind, category, from, to]);
  const income = filtered.filter((entry) => entry.kind === "income").reduce((sum, entry) => sum + entry.amount, 0);
  const expenditure = filtered.filter((entry) => entry.kind === "expenditure").reduce((sum, entry) => sum + entry.amount, 0);
  const balance = income - expenditure;
  const unionFundEntries = filtered.filter((entry) => entry.kind === "income" && entry.category.trim().toLowerCase() === config.unionFundLabel.trim().toLowerCase());
  const otherIncomeEntries = filtered.filter((entry) => entry.kind === "income" && entry.category.trim().toLowerCase() !== config.unionFundLabel.trim().toLowerCase());
  const unionFundTotal = unionFundEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const otherIncomeTotal = otherIncomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const exportQuery = new URLSearchParams({
    kind,
    category,
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  }).toString();
  const chartData = useMemo(() => {
    const byDate = new Map<string, { unionFund: number; otherIncome: number; expenditure: number }>();
    filtered.forEach((entry) => {
      const date = entry.date.slice(0, 10);
      const current = byDate.get(date) || { unionFund: 0, otherIncome: 0, expenditure: 0 };
      if (entry.kind === "expenditure") current.expenditure += entry.amount;
      else if (entry.category.trim().toLowerCase() === config.unionFundLabel.trim().toLowerCase()) current.unionFund += entry.amount;
      else current.otherIncome += entry.amount;
      byDate.set(date, current);
    });
    return Array.from(byDate.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([date, values]) => ({ date, ...values }));
  }, [filtered, config.unionFundLabel]);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label={config.incomeLabel} amount={income} tone="income" icon={ArrowUpRight} reducedMotion={reducedMotion} />
        <SummaryCard label={config.expenditureLabel} amount={expenditure} tone="expense" icon={ArrowDownRight} reducedMotion={reducedMotion} />
        <SummaryCard label="Current balance" amount={balance} tone="balance" icon={Landmark} reducedMotion={reducedMotion} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <IncomeGroup title={config.unionFundLabel} description="Collections received from students, shown by collection period." total={unionFundTotal} entries={unionFundEntries} tone="emerald" />
        <IncomeGroup title={config.otherIncomeLabel} description="Sponsorships, coupon sales, donations, and other named income streams." total={otherIncomeTotal} entries={otherIncomeEntries} tone="purple" />
      </div>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[var(--shadow-card)] sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white"><CalendarDays className="h-4 w-4 text-purple-300" /> Account history</div>
              <p className="mt-1 text-xs text-white/45">Filter the public record by type, category, or date range.</p>
            </div>
            {config.allowPdfExport && (
              <a href={`/api/finance/pdf?${exportQuery}`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-purple-400/30 bg-purple-500/15 px-3 py-2 text-xs font-semibold text-purple-100 transition hover:bg-purple-500/25">
                <Download className="h-4 w-4" /> Download PDF
              </a>
            )}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <FilterSelect label="View" value={kind} onChange={(value) => setKind(value as typeof kind)} options={[["all", "All entries"], ["income", config.incomeLabel], ["expenditure", config.expenditureLabel]]} />
            <FilterSelect label="Category" value={category} onChange={setCategory} options={[["all", "All categories"], ...categories.map((value) => [value, value])]} />
            <label className="text-xs text-white/50">From<input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="mt-1 block w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white [color-scheme:dark]" /></label>
            <label className="text-xs text-white/50">To<input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="mt-1 block w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white [color-scheme:dark]" /></label>
          </div>
          <div className="mt-6 max-h-[360px] space-y-2 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {filtered.slice(0, 12).map((entry) => (
                <motion.div key={entry.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-2xl border border-white/8 bg-black/15 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><p className="truncate text-sm text-white/80">{entry.label}</p><p className="mt-1 text-xs text-white/35">{entry.category} · {formatPeriod(entry.date, entry.endDate)}</p></div>
                    <strong className={`shrink-0 text-sm ${entry.kind === "income" ? "text-emerald-300" : "text-rose-300"}`}>{entry.kind === "income" ? "+" : "−"}{money(entry.amount)}</strong>
                  </div>
                  {entry.note && <p className="mt-2 text-xs leading-relaxed text-white/45">{entry.note}</p>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {filtered.length > 12 && (
            <p className="mt-3 text-center text-[11px] text-white/35">
              Showing the latest 12 entries. Use Download PDF for the complete filtered list.
            </p>
          )}
      </section>
      {config.showGraph && <FinanceGraph data={chartData} config={config} reducedMotion={reducedMotion} />}
    </div>
  );
}

function FinanceGraph({
  data,
  config,
  reducedMotion,
}: {
  data: { date: string; unionFund: number; otherIncome: number; expenditure: number }[];
  config: Config;
  reducedMotion: boolean | null;
}) {
  const width = 840;
  const height = 300;
  const left = 48;
  const right = 18;
  const top = 22;
  const bottom = 44;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maximum = Math.max(...data.flatMap((point) => [point.unionFund, point.otherIncome, point.expenditure]), 1);
  const x = (index: number) => left + (data.length <= 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth);
  const y = (amount: number) => top + plotHeight - (amount / maximum) * plotHeight;
  const series = [
    { key: "unionFund", label: config.unionFundLabel, color: "#34d399" },
    { key: "otherIncome", label: config.otherIncomeLabel, color: "#c084fc" },
    { key: "expenditure", label: config.expenditureLabel, color: "#fb7185" },
  ] as const;
  const pathFor = (key: (typeof series)[number]["key"]) =>
    data.map((point, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(point[key])}`).join(" ");

  return (
    <section className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[var(--shadow-card)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-300">Live overview</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Income & expenditure over time</h2>
          <p className="mt-1 text-xs text-white/45">Amounts are grouped by the start date of each recorded collection period.</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/65">
          {series.map((item) => (
            <span key={item.key} className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
      {data.length === 0 ? (
        <p className="py-16 text-center text-sm text-white/45">Apply a broader filter or add entries to see the graph.</p>
      ) : (
        <div className="mt-6 overflow-x-auto pb-1">
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Finance activity graph" className="h-auto min-w-[620px] w-full">
            {[0, 0.5, 1].map((ratio) => {
              const value = maximum * ratio;
              return (
                <g key={ratio}>
                  <line x1={left} x2={width - right} y1={y(value)} y2={y(value)} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 6" />
                  <text x={left - 8} y={y(value) + 4} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="10">{shortMoney(value)}</text>
                </g>
              );
            })}
            {series.map((item) => (
              <motion.path
                key={item.key}
                d={pathFor(item.key)}
                fill="none"
                stroke={item.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reducedMotion ? false : { pathLength: 0, opacity: 0.5 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: reducedMotion ? 0 : 1, ease: "easeOut" }}
              />
            ))}
            {data.map((point, index) => (
              <g key={point.date}>
                {series.map((item) => (
                  <circle key={item.key} cx={x(index)} cy={y(point[item.key])} r="4" fill="#11091b" stroke={item.color} strokeWidth="2">
                    <title>{`${item.label}: ${money(point[item.key])} on ${formatDate(point.date)}`}</title>
                  </circle>
                ))}
                {(index === 0 || index === data.length - 1 || data.length < 5) && (
                  <text x={x(index)} y={height - 15} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10">{formatShortDate(point.date)}</text>
                )}
              </g>
            ))}
          </svg>
        </div>
      )}
    </section>
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
  const date = new Date(value);
  return date.getFullYear() < 1900 ? "Date not specified" : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

function formatPeriod(start: string, end: string | null) {
  const from = formatDate(start);
  return end ? `${from} – ${formatDate(end)}` : from;
}

function shortMoney(value: number) {
  if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}k`;
  return `₹${Math.round(value)}`;
}

function formatShortDate(value: string) {
  const date = new Date(value);
  return date.getFullYear() < 1900 ? "—" : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(date);
}

function IncomeGroup({
  title,
  description,
  total,
  entries,
  tone,
}: {
  title: string;
  description: string;
  total: number;
  entries: Entry[];
  tone: "emerald" | "purple";
}) {
  return (
    <section className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-5">
      <div className="flex items-start justify-between gap-3">
        <div><h2 className="text-base font-semibold text-white">{title}</h2><p className="mt-1 text-xs leading-relaxed text-white/45">{description}</p></div>
        <strong className={`shrink-0 text-lg ${tone === "emerald" ? "text-emerald-300" : "text-purple-200"}`}>{money(total)}</strong>
      </div>
      <div className="mt-4 space-y-2">
        {entries.length === 0 ? <p className="text-xs text-white/35">No entries in this period.</p> : entries.slice(0, 4).map((entry) => (
          <div key={entry.id} className="flex items-center justify-between gap-3 rounded-xl bg-black/15 px-3 py-2">
            <div className="min-w-0"><p className="truncate text-xs text-white/75">{entry.label}</p><p className="text-[10px] text-white/35">{formatPeriod(entry.date, entry.endDate)}</p></div>
            <span className="shrink-0 text-xs font-semibold text-emerald-300">+{money(entry.amount)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
