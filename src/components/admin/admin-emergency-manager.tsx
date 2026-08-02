"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pencil, Phone, ArrowUp, ArrowDown, Hash, Search, Filter, X, Home } from "lucide-react";
import { EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { DeleteBtn } from "@/components/admin/form-fields";
import { deleteEmergency, moveEmergency, toggleShowOnHomepage } from "@/lib/actions/emergency";

type EmergencyItem = {
  id: string;
  category: string;
  name: string;
  phone: string;
  description: string | null;
  order: number;
  active: boolean;
  showOnHomepage: boolean;
};

export function AdminEmergencyManager({ items }: { items: EmergencyItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract unique categories from contacts
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["All", ...Array.from(set)];
  }, [items]);

  // Filter contacts by category and search query
  const filteredItems = useMemo(() => {
    return items.filter((c) => {
      if (selectedCategory !== "All" && c.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Admin Search & Category Filter Controls */}
      <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-[var(--shadow-soft)] space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts by name, phone, or category..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-ink-200 bg-ink-50/50 text-sm text-ink-800 placeholder:text-ink-400 focus:bg-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-ink-200 flex-wrap">
          <span className="text-xs font-semibold text-ink-500 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Category:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === "All" ? items.length : items.filter((i) => i.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                    : "bg-ink-50 border-ink-200 text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Header and counter */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-semibold text-ink-900 text-sm">
          Contacts ({filteredItems.length} of {items.length})
        </h3>
        <span className="text-xs text-ink-500">
          Use ↑ ↓ to reorder priority on website
        </span>
      </div>

      {/* Contacts List */}
      {filteredItems.length === 0 ? (
        <EmptyRow>No matching emergency contacts found.</EmptyRow>
      ) : (
        <div className="space-y-2.5">
          {filteredItems.map((c, index) => {
            // Check absolute index in the master list for move buttons
            const masterIndex = items.findIndex((item) => item.id === c.id);

            return (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white p-3.5 shadow-[var(--shadow-soft)] transition-colors hover:border-purple-200"
              >
                {/* Order adjustment buttons */}
                <div className="flex flex-col items-center gap-0.5 shrink-0 border-r border-ink-100 pr-2">
                  <form action={moveEmergency.bind(null, c.id, "up")}>
                    <button
                      type="submit"
                      disabled={masterIndex === 0}
                      title="Move Up (Show higher)"
                      className="flex h-6 w-6 items-center justify-center rounded text-ink-400 hover:bg-purple-50 hover:text-purple-600 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-ink-400"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                  </form>
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-mono font-medium text-ink-400">
                    <Hash className="h-2.5 w-2.5" />
                    {c.order}
                  </span>
                  <form action={moveEmergency.bind(null, c.id, "down")}>
                    <button
                      type="submit"
                      disabled={masterIndex === items.length - 1}
                      title="Move Down (Show lower)"
                      className="flex h-6 w-6 items-center justify-center rounded text-ink-400 hover:bg-purple-50 hover:text-purple-600 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-ink-400"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>

                {/* Contact Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-ink-900">{c.name}</span>
                    {!c.active && <StatusPill status="draft" />}
                    {c.showOnHomepage && (
                      <span className="inline-flex items-center gap-1 rounded bg-purple-100 border border-purple-200 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700">
                        <Home className="h-2.5 w-2.5" /> Homepage
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-ink-500 flex-wrap">
                    <span className="rounded-md bg-purple-50 border border-purple-100 px-2 py-0.5 font-medium text-purple-700">
                      {c.category}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-ink-700 font-medium">
                      <Phone className="h-3 w-3 text-ink-400" /> {c.phone}
                    </span>
                    {c.description && (
                      <span className="text-ink-400 truncate max-w-[200px]">
                        • {c.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <form action={toggleShowOnHomepage.bind(null, c.id)}>
                    <button
                      type="submit"
                      title={c.showOnHomepage ? "Remove from Homepage" : "Show on Homepage"}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        c.showOnHomepage
                          ? "bg-purple-100 text-purple-600 hover:bg-purple-200"
                          : "text-ink-300 hover:bg-ink-100 hover:text-purple-600"
                      }`}
                    >
                      <Home className="h-4 w-4" />
                    </button>
                  </form>
                  <Link
                    href={`/adminahnuok/emergency/${c.id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-purple-600"
                    title="Edit Contact"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <form action={deleteEmergency.bind(null, c.id)}>
                    <DeleteBtn label="" />
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
