"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Download,
  Eye,
  Search,
  Pin,
  Calendar,
  ExternalLink,
  Tag,
  ArrowRight,
  X,
} from "lucide-react";
import { PdfViewerModal } from "./pdf-viewer-modal";

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
  const [activePdf, setActivePdf] = useState<{ title: string; pdfUrl: string } | null>(null);
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
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search representations, official letters, requests…"
            className="w-full rounded-full border border-ink-200 bg-white pl-10 pr-4 py-2.5 text-sm text-ink-800 outline-none transition-colors placeholder:text-ink-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
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
                  ? "bg-purple-600 text-white shadow-sm"
                  : "border border-ink-200 bg-white text-ink-600 hover:border-purple-300 hover:text-purple-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Intervention Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-ink-100 bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <FileText className="mx-auto h-12 w-12 text-ink-300" strokeWidth={1.5} />
          <h3 className="mt-4 text-base font-bold text-ink-800">No interventions found</h3>
          <p className="mt-1 text-sm text-ink-500">
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
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
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
                  <div className="relative flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-purple-800/10 p-6 text-purple-700">
                    <FileText className="h-16 w-16 opacity-30" strokeWidth={1.2} />
                  </div>
                )}

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Category & Date Header */}
                  <div className="mb-3 flex items-center gap-2 text-xs text-ink-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-purple-500" />
                      {formattedDate}
                    </span>
                    {item.category && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-purple-50 px-2 py-0.5 font-medium text-purple-700">
                          <Tag className="h-3 w-3" />
                          {item.category}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-bold leading-snug text-ink-900 transition-colors group-hover:text-purple-700">
                    {item.title}
                  </h3>

                  {/* Short Description */}
                  <p className="line-clamp-3 mb-6 text-sm leading-relaxed text-ink-500">
                    {item.description}
                  </p>

                  {/* Actions Footer */}
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-ink-100 pt-4">
                    {/* PDF button */}
                    {item.pdfUrl ? (
                      <button
                        onClick={() => setActivePdf({ title: item.title, pdfUrl: item.pdfUrl! })}
                        className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3.5 py-1.5 text-xs font-semibold text-purple-700 transition-colors hover:bg-purple-100"
                      >
                        <Eye className="h-3.5 w-3.5" /> View PDF
                      </button>
                    ) : (
                      <span className="text-xs text-ink-400">Official Release</span>
                    )}

                    {/* Read More button */}
                    <button
                      onClick={() => setReadingItem(item)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800"
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

      {/* PDF Modal */}
      {activePdf && (
        <PdfViewerModal
          title={activePdf.title}
          pdfUrl={activePdf.pdfUrl}
          onClose={() => setActivePdf(null)}
        />
      )}

      {/* Read More Modal */}
      {readingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/70 p-4 backdrop-blur-sm">
          <div className="flex h-full max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-ink-100">
              <div>
                <span className="text-xs font-medium text-purple-600">
                  {formatDate(readingItem.date)}
                </span>
                <h3 className="text-xl font-bold text-ink-900 mt-1">{readingItem.title}</h3>
              </div>
              <button
                onClick={() => setReadingItem(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-ink-100 hover:text-ink-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-4 text-sm leading-relaxed text-ink-700 whitespace-pre-wrap">
              {readingItem.image && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-ink-50 mb-4">
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

            <div className="flex items-center justify-between border-t border-ink-100 pt-4">
              {readingItem.pdfUrl ? (
                <button
                  onClick={() => {
                    const pdf = { title: readingItem.title, pdfUrl: readingItem.pdfUrl! };
                    setReadingItem(null);
                    setActivePdf(pdf);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-700"
                >
                  <FileText className="h-4 w-4" /> Open Official PDF
                </button>
              ) : (
                <span className="text-xs text-ink-400">No PDF attached</span>
              )}
              <button
                onClick={() => setReadingItem(null)}
                className="rounded-full border border-ink-200 px-5 py-2 text-xs font-semibold text-ink-600 hover:bg-ink-50"
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
