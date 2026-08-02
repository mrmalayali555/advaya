"use client";

import { useState, useTransition } from "react";
import { Home, Eye, EyeOff, Info } from "lucide-react";
import { toggleHomepageEmergencySection } from "@/lib/actions/emergency";

export function HomepageSectionToggle({
  initialEnabled,
  homepageCount,
  totalActive,
}: {
  initialEnabled: boolean;
  homepageCount: number;
  totalActive: number;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const newValue = !enabled;
    setEnabled(newValue);
    startTransition(async () => {
      await toggleHomepageEmergencySection(newValue);
    });
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-ink-900">Homepage Emergency Section</h3>
            <p className="mt-0.5 text-sm text-ink-500">
              Control whether the emergency contacts strip appears on the homepage.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={handleToggle}
          className={`inline-flex items-center gap-2 self-start rounded-full px-5 py-2 text-sm font-semibold transition-all border ${
            enabled
              ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              : "bg-ink-50 border-ink-200 text-ink-500 hover:bg-ink-100"
          } ${isPending ? "opacity-60 pointer-events-none" : ""}`}
        >
          {enabled ? (
            <>
              <Eye className="h-4 w-4" /> Visible on Homepage
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4" /> Hidden from Homepage
            </>
          )}
        </button>
      </div>

      {enabled && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-purple-50/60 border border-purple-100 px-4 py-3 text-xs text-purple-800">
          <Info className="h-3.5 w-3.5 text-purple-500 shrink-0" />
          <span>
            <strong>{homepageCount}</strong> of {totalActive} active contacts are marked
            {" "}<span className="font-semibold">&quot;Show on Homepage&quot;</span>.
            {homepageCount === 0 && (
              <span className="text-purple-600 font-medium">
                {" "}The first 6 active contacts will be shown as fallback. Toggle &quot;Show on Homepage&quot; on specific contacts below to customise.
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
