"use client";

import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

interface FinanceCardProps {
  totalIncome: number;
  totalExpenditure: number;
  balance: number;
}

export function FinanceCard({ totalIncome, totalExpenditure, balance }: FinanceCardProps) {
  const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
  
  // Calculate percentage of budget used
  const expenditurePercentage = totalIncome > 0 ? ((totalExpenditure / totalIncome) * 100).toFixed(1) : "0";
  const balancePercentage = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0";

  // Calculate dynamic spline coordinates based on real financial ratio
  const ratio = totalIncome > 0 ? balance / totalIncome : 0.5;
  // Map ratio to Y coordinate between [20, 80] (lower Y = higher visual peak)
  const endY = Math.max(20, Math.min(80, 90 - ratio * 70));
  
  const pathD = `M0,75 C75,${90 - (90 - endY) * 0.2} 120,${endY + 15} 180,${(75 + endY) / 2} S240,${endY - 10} 300,${endY}`;
  const fillD = `M0,100 L0,75 C75,${90 - (90 - endY) * 0.2} 120,${endY + 15} 180,${(75 + endY) / 2} S240,${endY - 10} 300,${endY} L300,100 Z`;

  return (
    <div className="flex justify-center items-center py-6 w-full px-2 sm:px-0">
      <div className="group relative w-full max-w-lg overflow-hidden rounded-3xl border border-purple-100/50 bg-white/70 p-6 font-sans shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-purple-900/10">
        
        {/* Soft decorative glow background matching light purple theme */}
        <div className="absolute -top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-600/5 blur-3xl transition-all duration-700 group-hover:bg-purple-600/10"></div>

        <div className="relative flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-purple-100/40 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/10 text-purple-600">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Union Balance</p>
                <p className="text-2xl font-black text-purple-900 mt-0.5">{inr(balance)}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full">
              Active Session
            </span>
          </div>

          {/* Revenue vs Costs Column Summary (Responsive stacked on mobile) */}
          <div className="flex flex-col sm:flex-row gap-4 divide-y sm:divide-y-0 sm:divide-x divide-purple-100/40">
            <div className="flex-1 pb-4 sm:pb-0 sm:pr-6">
              <div className="flex items-center gap-1.5 text-ink-400">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs font-semibold">Total Income</span>
              </div>
              <p className="text-xl font-bold text-ink-900 mt-1">{inr(totalIncome)}</p>
              <p className="mt-1 text-[10px] font-bold text-emerald-600">+100% Recv</p>
            </div>
            
            <div className="flex-1 pt-4 sm:pt-0 sm:pl-6">
              <div className="flex items-center gap-1.5 text-ink-400">
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                <span className="text-xs font-semibold">Expenditure</span>
              </div>
              <p className="text-xl font-bold text-ink-900 mt-1">{inr(totalExpenditure)}</p>
              <p className="mt-1 text-[10px] font-bold text-red-500">-{expenditurePercentage}% Used</p>
            </div>
          </div>

          {/* SVG Trend Wave Graphic with dynamic height and tracer */}
          <div className="relative h-24 w-full">
            <svg
              className="h-full w-full"
              viewBox="0 0 300 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="purple-aurora-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7e56a5" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#7e56a5" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path
                d={pathD}
                fill="none"
                stroke="#7e56a5"
                strokeWidth="2.5"
                strokeLinecap="round"
              ></path>
              <path
                d={fillD}
                fill="url(#purple-aurora-gradient)"
              ></path>
            </svg>
            
            {/* Glowing tracer node placed dynamically at the end of the wave line */}
            <div className="absolute right-[-1px] transition-all duration-500" style={{ top: `${endY}px` }}>
              <div className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"></div>
              <div className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/20 animate-ping"></div>
            </div>
          </div>

          {/* Footer Info details */}
          <div className="border-t border-purple-100/40 pt-4 flex items-center justify-between text-xs text-ink-500 font-medium">
            <span>Net Reserves: {balancePercentage}%</span>
            <span>Audited & Signed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
