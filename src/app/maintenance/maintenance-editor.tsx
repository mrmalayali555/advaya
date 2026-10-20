"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { saveMaintenanceMode } from "@/lib/actions/content";
import type { MaintenanceSettings } from "@/lib/maintenance-settings";
import { MAINTENANCE_ANIMATIONS } from "@/lib/maintenance-settings";

export function MaintenanceEditor({ settings }: { settings: MaintenanceSettings }) {
  const [open, setOpen] = useState(false);

  if (!settings.enabled) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:ring-offset-2 focus:ring-offset-[#050208]"
        aria-label="Edit maintenance page"
        title="Edit maintenance page"
      >
        <Pencil size={18} aria-hidden="true" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="maintenance-editor-title"
        >
          <div className="max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/15 bg-[#17101f] p-5 text-white shadow-2xl sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-200/70">
                  Admin preview
                </p>
                <h2 id="maintenance-editor-title" className="mt-2 text-xl font-semibold">
                  Customize maintenance page
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-200"
                aria-label="Close editor"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <form action={saveMaintenanceMode} className="space-y-4">
              <input type="hidden" name="maintenance_mode" value="on" />
              <input type="hidden" name="maintenance_return" value="site" />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-white/80">Small heading</span>
                <input name="maintenance_eyebrow" defaultValue={settings.eyebrow} required maxLength={120} className="maintenance-editor-input" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-white/80">Main heading</span>
                <input name="maintenance_title" defaultValue={settings.title} required maxLength={160} className="maintenance-editor-input" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-white/80">Message</span>
                <textarea name="maintenance_message" defaultValue={settings.message} required maxLength={500} rows={4} className="maintenance-editor-input resize-y" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-white/80">Status label</span>
                  <input name="maintenance_status" defaultValue={settings.status} required maxLength={80} className="maintenance-editor-input" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-white/80">Animation</span>
                  <select name="maintenance_animation" defaultValue={settings.animation} className="maintenance-editor-input">
                    {MAINTENANCE_ANIMATIONS.map((animation) => (
                      <option key={animation.value} value={animation.value}>{animation.label}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-white/80">Footer brand line</span>
                <input name="maintenance_footer" defaultValue={settings.footer} required maxLength={120} className="maintenance-editor-input" />
              </label>
              <button type="submit" className="w-full rounded-xl bg-purple-300 px-4 py-3 text-sm font-semibold text-[#17101f] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200">
                Save changes
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
