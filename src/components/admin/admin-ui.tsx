import Link from "next/link";
import { type ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="w-full sm:w-auto min-w-0">
        <h1 className="text-xl font-bold text-ink-900 sm:text-2xl lg:text-3xl break-words">{title}</h1>
        {description && <p className="mt-1 text-xs sm:text-sm text-ink-500 break-words">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(91,42,134,0.39)] transition-all hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-[0_6px_20px_rgba(91,42,134,0.23)]"
        >
          <Plus className="h-4 w-4" /> {action.label}
        </Link>
      )}
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-ink-100 bg-white p-4 sm:p-6 shadow-[var(--shadow-soft)] min-w-0 max-w-full overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
  href?: string;
}) {
  const inner = (
    <div className="rounded-2xl border border-ink-100 bg-white p-4 sm:p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] min-w-0 max-w-full">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
          {icon}
        </div>
      </div>
      <div className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 break-words">{value}</div>
      <div className="mt-1 text-xs sm:text-sm text-ink-500 break-words line-clamp-2">{label}</div>
    </div>
  );
  return href ? <Link href={href} className="min-w-0 max-w-full">{inner}</Link> : inner;
}

export function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-12 text-center text-sm text-ink-400">
      {children}
    </div>
  );
}

const toneClasses: Record<string, string> = {
  new: "bg-purple-100 text-purple-700",
  read: "bg-blue-100 text-blue-700",
  resolved: "bg-emerald-100 text-emerald-700",
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  sports: "bg-blue-100 text-blue-700",
  arts: "bg-purple-100 text-purple-700",
  academics: "bg-emerald-100 text-emerald-700",
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        toneClasses[status] ?? "bg-ink-100 text-ink-600"
      )}
    >
      {status}
    </span>
  );
}
