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
    <div className="glass-card rounded-3xl border-dashed py-20 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-900/30 text-purple-400">
        {icon ?? <Inbox className="h-7 w-7" strokeWidth={1.5} />}
      </div>
      <p className="text-lg font-medium text-on-surface">{title}</p>
      <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
    </div>
  );
}
