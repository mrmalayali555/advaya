"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Download,
  Search,
  Pin,
  Calendar,
  Tag,
  ArrowRight,
  X,
  ExternalLink,
} from "lucide-react";

interface InterventionItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: Date | string;
  image?: string | null;
  pdfUrl?: string | null;
  category?: string | null;
  pinned: boolean;
}

export function InterventionsList({ items }: { items: InterventionItem[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [readingItem, setReadingItem] = useState<InterventionItem | null>(null);

  // Categories list
  const categories = ["all", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean))) as string[]];

  const filtered = items.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Search & Category Filter Bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search representations, official letters, requests…"
            className="w-full rounded-full border border-white/15 bg-white/10 pl-10 pr-4 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-white/40 focus:border-purple-400 focus:bg-white/15 focus:ring-2 focus:ring-purple-500/30 backdrop-blur-md"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition-all ${
                activeCategory === cat
                  ? "bg-purple-600 text-white shadow-[0_8px_20px_-8px_rgba(91,42,134,0.6)]"
                  : "glass-card text-on-surface-variant hover:border-purple-400 hover:text-purple-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Intervention Cards */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-3xl border border-white/10 py-12 text-center shadow-2xl">
          <FileText className="mx-auto h-12 w-12 text-white/30" strokeWidth={1.5} />
          <h3 className="mt-4 text-base font-bold text-on-surface">No interventions found</h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            {search ? `No results for “${search}”` : "No official interventions published yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const formattedDate = formatDate(item.date);
            return (
              <div
                key={item.id}
                className="glass-card group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_32px_rgba(120,0,255,0.15)]"
              >
                {/* Pinned badge */}
                {item.pinned && (
                  <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-purple-600/90 px-3 py-1 text-[11px] font-semibold text-white shadow backdrop-blur">
                    <Pin className="h-3 w-3 fill-current" /> Pinned
                  </div>
                )}

                {/* Cover Image */}
                {item.image ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  </div>
                ) : (
                  <div className="relative flex aspect-[16/9] w-full items-center justify-center bg-purple-950/40 border-b border-white/5 p-6 text-purple-300">
                    <FileText className="h-16 w-16 opacity-30" strokeWidth={1.2} />
                  </div>
                )}

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Category & Date Header */}
                  <div className="mb-3 flex items-center gap-2 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-purple-400" />
                      {formattedDate}
                    </span>
                    {item.category && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-purple-900/30 border border-purple-500/20 px-2 py-0.5 font-medium text-purple-300">
                          <Tag className="h-3 w-3" />
                          {item.category}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-bold leading-snug text-on-surface transition-colors group-hover:text-purple-300">
                    {item.title}
                  </h3>

                  {/* Short Description */}
                  <p className="line-clamp-3 mb-6 text-sm leading-relaxed text-on-surface-variant">
                    {item.description}
                  </p>

                  {/* Actions Footer */}
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/10 pt-4">
                    {/* PDF button */}
                    {item.pdfUrl ? (
                      <a
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-purple-900/30 border border-purple-500/20 px-3.5 py-1.5 text-xs font-semibold text-purple-300 transition-colors hover:bg-purple-900/50"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> View PDF
                      </a>
                    ) : (
                      <span className="text-xs text-white/40">Official Release</span>
                    )}

                    {/* Read More button */}
                    <button
                      onClick={() => setReadingItem(item)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300"
                    >
                      Read More <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Read More Modal */}
      {readingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="glass-card flex h-full max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#140a23]/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-medium text-purple-400">
                  {formatDate(readingItem.date)}
                </span>
                <h3 className="text-xl font-bold text-on-surface mt-1">{readingItem.title}</h3>
              </div>
              <button
                onClick={() => setReadingItem(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-4 text-sm leading-relaxed text-on-surface-variant whitespace-pre-wrap">
              {readingItem.image && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-white/5 mb-4">
                  <Image
                    src={readingItem.image}
                    alt={readingItem.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <p>{readingItem.description}</p>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              {readingItem.pdfUrl ? (
                <a
                  href={readingItem.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" /> Open Official PDF
                </a>
              ) : (
                <span className="text-xs text-white/40">No PDF attached</span>
              )}
              <button
                onClick={() => setReadingItem(null)}
                className="rounded-full border border-white/10 px-5 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
