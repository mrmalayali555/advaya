"use client";

import React from "react";
import { SECTION_META, SectionType } from "@/lib/page-builder-types";
import { X } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface SectionPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: SectionType) => void;
}

export function SectionPicker({ isOpen, onClose, onSelect }: SectionPickerProps) {
  if (!isOpen) return null;

  // Group by category
  const grouped = SECTION_META.reduce((acc, meta) => {
    if (!acc[meta.category]) acc[meta.category] = [];
    acc[meta.category].push(meta);
    return acc;
  }, {} as Record<string, typeof SECTION_META>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">
      <div className="flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-ink-900">Add Section</h2>
          <button onClick={onClose} className="rounded-full p-2 text-ink-500 hover:bg-ink-50 hover:text-ink-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wider text-ink-500">{category}</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const Icon = (LucideIcons as any)[item.icon] || LucideIcons.FileText;
                  return (
                    <button
                      key={item.type}
                      onClick={() => onSelect(item.type)}
                      className="group flex flex-col items-start rounded-xl border border-ink-100 bg-white p-4 text-left transition-all hover:border-indigo-500 hover:shadow-[var(--shadow-soft)]"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className="mb-1 font-medium text-ink-900">{item.label}</h4>
                      <p className="text-xs text-ink-500">{item.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
