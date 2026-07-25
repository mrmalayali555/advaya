import { Inbox } from "lucide-react";
import { type ReactNode } from "react";

export function EmptyState({
  title = "Nothing here yet.",
  description = "Check back soon.",
  icon,
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-ink-200 bg-surface py-20 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-500">
        {icon ?? <Inbox className="h-7 w-7" strokeWidth={1.5} />}
      </div>
      <p className="text-lg font-medium text-ink-700">{title}</p>
      <p className="mt-1 text-sm text-ink-400">{description}</p>
    </div>
  );
}
