"use client";

import { useState, useMemo } from "react";
import {
  Phone,
  Building2,
  Shield,
  Siren,
  Search,
  Copy,
  Check,
  Users,
  Car,
  Home,
  ShieldAlert,
  Zap,
  Calendar,
  Clock,
  LayoutGrid,
  Layers,
  List,
  ChevronDown,
  X,
  Sparkles,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";

type EmergencyContact = {
  id: string;
  category: string;
  name: string;
  phone: string;
  description: string | null;
  order: number;
  active: boolean;
};

interface PdfData {
  url: string;
  name: string;
}

const WATCHMEN_SCHEDULE = [
  { day: "Monday", duty1: "Mr. Satheesh", phone1: "91422 29998", duty2: "Mr. Anandu", phone2: "98463 81767" },
  { day: "Tuesday", duty1: "Mr. Krishnakumar", phone1: "99466 41956", duty2: "Mr. Harikrishnan", phone2: "80787 88043" },
  { day: "Wednesday", duty1: "Mr. Sebastian", phone1: "96455 33771", duty2: "Mr. Sujith", phone2: "90741 94761" },
  { day: "Thursday", duty1: "Mr. Satheesh", phone1: "91422 29998", duty2: "Mr. Renjith", phone2: "62829 97904" },
  { day: "Friday", duty1: "Mr. Anandu", phone1: "98463 81767", duty2: "Mr. Saran", phone2: "79946 68518" },
  { day: "Saturday", duty1: "Mr. Krishnakumar", phone1: "99466 41956", duty2: "Mr. Sebastian", phone2: "96455 33771" },
  { day: "Sunday", duty1: "Mr. Harikrishnan", phone1: "80787 88043", duty2: "Mr. Sujith", phone2: "90741 94761" },
];

function getCategoryTheme(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes("emergency") || cat.includes("ambulance") || cat.includes("fire")) {
    return {
      icon: <Siren className="h-4 w-4 sm:h-5 sm:w-5" />,
      badge: "bg-red-500/15 text-red-400 border-red-500/20",
      accent: "from-red-500/20 to-orange-500/10",
      btn: "bg-red-600 hover:bg-red-700 text-white shadow-red-900/40",
    };
  }
  if (cat.includes("hospital") || cat.includes("college & hospital")) {
    return {
      icon: <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />,
      badge: "bg-blue-500/15 text-blue-400 border-blue-500/20",
      accent: "from-blue-500/20 to-cyan-500/10",
      btn: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/40",
    };
  }
  if (cat.includes("union")) {
    return {
      icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />,
      badge: "bg-purple-500/15 text-purple-400 border-purple-500/20",
      accent: "from-purple-500/20 to-pink-500/10",
      btn: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-900/40",
    };
  }
  if (cat.includes("hostel") || cat.includes("men") || cat.includes("ladies")) {
    return {
      icon: <Home className="h-4 w-4 sm:h-5 sm:w-5" />,
      badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      accent: "from-emerald-500/20 to-teal-500/10",
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/40",
    };
  }
  if (cat.includes("police") || cat.includes("security")) {
    return {
      icon: <ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5" />,
      badge: "bg-amber-500/15 text-amber-400 border-amber-500/20",
      accent: "from-amber-500/20 to-yellow-500/10",
      btn: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/40",
    };
  }
  if (cat.includes("watchmen")) {
    return {
      icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5" />,
      badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
      accent: "from-indigo-500/20 to-purple-500/10",
      btn: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/40",
    };
  }
  if (cat.includes("auto") || cat.includes("driver")) {
    return {
      icon: <Car className="h-4 w-4 sm:h-5 sm:w-5" />,
      badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
      accent: "from-yellow-500/20 to-orange-500/10",
      btn: "bg-yellow-600 hover:bg-yellow-700 text-ink-950 font-bold shadow-yellow-900/40",
    };
  }
  return {
    icon: <Phone className="h-4 w-4 sm:h-5 sm:w-5" />,
    badge: "bg-white/10 text-on-surface-variant border-white/10",
    accent: "from-white/10 to-transparent",
    btn: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-900/40",
  };
}

export function EmergencyDirectory({
  contacts,
  pdfData,
}: {
  contacts: EmergencyContact[];
  pdfData?: PdfData | null;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPreset, setSelectedPreset] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [only24x7, setOnly24x7] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"order" | "name" | "category">("order");
  const [viewMode, setViewMode] = useState<"grid" | "grouped" | "compact">("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // Extract available unique categories
  const categories = useMemo(() => {
    const set = new Set(contacts.map((c) => c.category));
    return ["All", ...Array.from(set)];
  }, [contacts]);

  // Quick preset definitions
  const PRESETS = useMemo(
    () => [
      { id: "all", label: "All Contacts", emoji: "⚡", count: contacts.length },
      {
        id: "critical",
        label: "24x7 Helplines",
        emoji: "🚨",
        match: (c: EmergencyContact) =>
          c.category.toLowerCase().includes("emergency") ||
          c.phone.length <= 4 ||
          (c.description && c.description.toLowerCase().includes("24x7")),
      },
      {
        id: "hospital",
        label: "Hospital & Care",
        emoji: "🏥",
        match: (c: EmergencyContact) =>
          c.category.toLowerCase().includes("hospital") ||
          c.name.toLowerCase().includes("ambulance") ||
          c.name.toLowerCase().includes("hospital"),
      },
      {
        id: "hostels",
        label: "Hostels (MH/LH)",
        emoji: "🏠",
        match: (c: EmergencyContact) =>
          c.category.toLowerCase().includes("hostel") ||
          c.name.toLowerCase().includes("warden") ||
          c.name.toLowerCase().includes("hostel"),
      },
      {
        id: "security",
        label: "Watchmen & Security",
        emoji: "🛡️",
        match: (c: EmergencyContact) =>
          c.category.toLowerCase().includes("watchmen") ||
          c.category.toLowerCase().includes("police") ||
          c.name.toLowerCase().includes("sergeant"),
      },
      {
        id: "union",
        label: "Student Union",
        emoji: "🎓",
        match: (c: EmergencyContact) => c.category.toLowerCase().includes("union"),
      },
      {
        id: "auto",
        label: "Night Autos",
        emoji: "🛺",
        match: (c: EmergencyContact) => c.category.toLowerCase().includes("auto"),
      },
    ],
    [contacts]
  );

  // Filter contacts by category, preset, 24x7 toggle, and query
  const filteredContacts = useMemo(() => {
    let result = contacts.filter((c) => {
      // Category filter
      if (selectedCategory !== "All" && c.category !== selectedCategory) return false;

      // Preset filter
      if (selectedPreset !== "all") {
        const preset = PRESETS.find((p) => p.id === selectedPreset);
        if (preset?.match && !preset.match(c)) return false;
      }

      // 24x7 toggle
      if (only24x7) {
        const desc = (c.description || "").toLowerCase();
        const cat = c.category.toLowerCase();
        const is24 = desc.includes("24x7") || cat.includes("emergency") || c.phone.length <= 4;
        if (!is24) return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "category") {
        return a.category.localeCompare(b.category) || a.order - b.order;
      }
      return a.order - b.order;
    });
  }, [contacts, selectedCategory, selectedPreset, only24x7, searchQuery, sortBy, PRESETS]);

  // Grouped contacts for "grouped" view
  const groupedContacts = useMemo(() => {
    const map = new Map<string, EmergencyContact[]>();
    for (const c of filteredContacts) {
      if (!map.has(c.category)) {
        map.set(c.category, []);
      }
      map.get(c.category)!.push(c);
    }
    return Array.from(map.entries());
  }, [filteredContacts]);

  const handleCopy = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSelectedPreset("all");
    setSearchQuery("");
    setOnly24x7(false);
    setSortBy("order");
  };

  const hasActiveFilters =
    selectedCategory !== "All" || selectedPreset !== "all" || searchQuery !== "" || only24x7;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Official Registry PDF Banner (if available) */}
      {pdfData && (
        <div className="rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-950/40 via-purple-950/30 to-surface-container-high/40 p-4 sm:p-5 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-semibold text-on-surface">
                    Official Emergency Directory (PDF)
                  </h3>
                  <span className="rounded-md bg-red-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-300 border border-red-500/30">
                    Official Copy
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                  Download or print the complete campus emergency directory & guidelines
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <a
                href={pdfData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all shadow-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View PDF</span>
              </a>
              <a
                href={pdfData.url}
                download={pdfData.name}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90 transition-all shadow-md shadow-red-950/40"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Quick Category Chips - Edge-to-edge scroll on mobile */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-400">
            Quick Categories
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-medium text-purple-400 hover:text-purple-300 underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Scrollable chip track with smooth swipe */}
        <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-2 pt-0.5 scrollbar-none sm:mx-0 sm:px-0">
          {PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset.id);
                  if (preset.id !== "all") setSelectedCategory("All");
                }}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-purple-600 border border-purple-400 text-white shadow-md shadow-purple-900/30"
                    : "bg-surface-container-high/60 border border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <span>{preset.emoji}</span>
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Search & Interactive Control Bar */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-surface-container-high/40 p-3.5 sm:p-5 backdrop-blur-xl space-y-3.5">
        {/* Search bar + 24x7 Toggle in a responsive flex layout */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search input */}
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts, roles, numbers..."
              className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl bg-surface-container-high/80 border border-white/10 text-on-surface placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs sm:text-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-ink-400 hover:text-white"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* 24x7 Filter Toggle button */}
          <button
            onClick={() => setOnly24x7((prev) => !prev)}
            className={`flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-3 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
              only24x7
                ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-900/40"
                : "bg-surface-container-high/80 border-white/10 text-on-surface-variant hover:text-white hover:bg-surface-container-high"
            }`}
          >
            <Zap className={`h-3.5 w-3.5 ${only24x7 ? "text-yellow-300 fill-yellow-300" : "text-ink-400"}`} />
            <span>24x7 Only</span>
          </button>
        </div>

        {/* Secondary controls: Horizontal category filter + View mode + Sort */}
        <div className="space-y-3 pt-2.5 border-t border-white/5">
          {/* Horizontal scrollable category pill list */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            <span className="text-[11px] font-medium text-ink-400 shrink-0 hidden sm:inline mr-1">
              Category:
            </span>
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              const count =
                category === "All"
                  ? contacts.length
                  : contacts.filter((c) => c.category === category).length;

              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedPreset("all");
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 transition-all border ${
                    isSelected
                      ? "bg-white/20 border-white/30 text-white shadow-sm"
                      : "bg-white/5 border-transparent text-ink-400 hover:text-on-surface hover:bg-white/10"
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>

          {/* Bottom row: Sort + View Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {/* Sort selector */}
            <div className="flex items-center gap-1.5 bg-surface-container-high/70 border border-white/10 rounded-xl px-2.5 py-1.5">
              <span className="text-[11px] text-ink-400 font-medium shrink-0">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-on-surface font-medium focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none truncate"
              >
                <option value="order" className="bg-surface-container-high text-on-surface">
                  Priority (Default)
                </option>
                <option value="name" className="bg-surface-container-high text-on-surface">
                  Name (A - Z)
                </option>
                <option value="category" className="bg-surface-container-high text-on-surface">
                  Category
                </option>
              </select>
            </div>

            {/* View Mode icons switcher */}
            <div className="flex items-center bg-surface-container-high/70 border border-white/10 rounded-xl p-1 gap-0.5">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === "grid" ? "bg-purple-600 text-white" : "text-ink-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode("grouped")}
                title="Grouped View"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === "grouped" ? "bg-purple-600 text-white" : "text-ink-400 hover:text-white"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Grouped</span>
              </button>
              <button
                onClick={() => setViewMode("compact")}
                title="Compact List View"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === "compact" ? "bg-purple-600 text-white" : "text-ink-400 hover:text-white"
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* College Watchmen Duty Roster Card */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-surface-container-high/40 p-4 sm:p-5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mt-0.5 sm:mt-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-semibold text-on-surface">
                  Campus Watchmen Duty Roster
                </h3>
                <span className="rounded-md bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-500/30">
                  Weekly
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Daily shifts & emergency contact for on-duty watchmen
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSchedule((prev) => !prev)}
            className="w-full sm:w-auto shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600/80 hover:bg-indigo-600 text-white transition-colors border border-indigo-400/30 shadow-sm text-center"
          >
            {showSchedule ? "Hide Roster" : "View Weekly Roster"}
          </button>
        </div>

        {/* Expandable Schedule Grid */}
        {showSchedule && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {WATCHMEN_SCHEDULE.map((item) => (
                <div
                  key={item.day}
                  className="rounded-xl border border-white/10 bg-surface-container-high/60 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      {item.day}
                    </span>
                    <Clock className="h-3 w-3 text-ink-400" />
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-on-surface font-medium truncate text-xs">{item.duty1}</span>
                      <a
                        href={`tel:${item.phone1.replace(/\s+/g, "")}`}
                        className="text-indigo-400 hover:underline font-mono text-[11px] shrink-0 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20"
                      >
                        {item.phone1}
                      </a>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-on-surface font-medium truncate text-xs">{item.duty2}</span>
                      <a
                        href={`tel:${item.phone2.replace(/\s+/g, "")}`}
                        className="text-indigo-400 hover:underline font-mono text-[11px] shrink-0 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20"
                      >
                        {item.phone2}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Header & Counter */}
      <div className="flex items-center justify-between text-xs text-ink-400 px-1">
        <span>
          Showing <strong className="text-on-surface">{filteredContacts.length}</strong> contacts
          {hasActiveFilters && " (Filtered)"}
        </span>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} className="text-purple-400 hover:underline font-medium">
            Reset Filters
          </button>
        )}
      </div>

      {/* Emergency Contacts Render */}
      {filteredContacts.length === 0 ? (
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-surface-container-high/20 p-8 sm:p-12 text-center">
          <Siren className="h-8 w-8 sm:h-10 sm:w-10 text-ink-400 mx-auto mb-3 opacity-60" />
          <h4 className="text-sm sm:text-base font-semibold text-on-surface">No matching contacts found</h4>
          <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
            Try adjusting your search query or clear the active category filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === "grouped" ? (
        /* --- GROUPED VIEW --- */
        <div className="space-y-6 sm:space-y-8">
          {groupedContacts.map(([category, items]) => {
            const theme = getCategoryTheme(category);
            return (
              <div key={category} className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-white/10 text-white">
                    {theme.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-on-surface truncate">{category}</h3>
                  <span className={`ml-auto text-[11px] px-2 py-0.5 rounded-full border shrink-0 ${theme.badge}`}>
                    {items.length} {items.length === 1 ? "contact" : "contacts"}
                  </span>
                </div>

                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((c) => (
                    <ContactCard
                      key={c.id}
                      contact={c}
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === "compact" ? (
        /* --- COMPACT LIST VIEW --- */
        <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-surface-container-high/40 backdrop-blur-md overflow-hidden">
          {filteredContacts.map((c) => {
            const theme = getCategoryTheme(c.category);
            const phones = c.phone.split(",").map((p) => p.trim());

            return (
              <div
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 hover:bg-white/5 transition-colors"
              >
                <div className="min-w-0 flex items-start gap-2.5 sm:gap-3">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white mt-0.5">
                    {theme.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-on-surface">{c.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${theme.badge}`}>
                        {c.category}
                      </span>
                    </div>
                    {c.description && (
                      <p className="text-xs text-ink-400 mt-0.5 line-clamp-1 max-w-md">{c.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-center">
                  <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
                    {phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${theme.btn}`}
                      >
                        <Phone className="h-3 w-3" />
                        <span>{phone}</span>
                      </a>
                    ))}
                  </div>
                  <button
                    onClick={() => handleCopy(c.phone, c.id)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ink-400 hover:text-white hover:bg-white/10"
                    title="Copy phone"
                  >
                    {copiedId === c.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* --- STANDARD GRID VIEW --- */
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContacts.map((c) => (
            <ContactCard
              key={c.id}
              contact={c}
              copiedId={copiedId}
              onCopy={handleCopy}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ContactCard({
  contact: c,
  copiedId,
  onCopy,
}: {
  contact: EmergencyContact;
  copiedId: string | null;
  onCopy: (phone: string, id: string) => void;
}) {
  const theme = getCategoryTheme(c.category);
  const phones = c.phone.split(",").map((p) => p.trim());

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-surface-container-high/60 to-surface-container-low/40 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-950/20">
      {/* Subtle gradient glow header */}
      <div
        className={`absolute inset-x-0 top-0 h-20 sm:h-24 bg-gradient-to-b ${theme.accent} rounded-t-2xl opacity-40 pointer-events-none`}
      />

      <div className="relative z-10 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10 group-hover:scale-105 transition-transform">
            {theme.icon}
          </div>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold truncate max-w-[150px] ${theme.badge}`}>
            {c.category}
          </span>
        </div>

        <div>
          <h3 className="text-sm sm:text-base font-bold text-on-surface group-hover:text-purple-300 transition-colors">
            {c.name}
          </h3>
          {c.description && (
            <p className="mt-1 text-xs text-on-surface-variant line-clamp-2">{c.description}</p>
          )}
        </div>
      </div>

      {/* Contact Actions: 1-tap call + Copy button */}
      <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {phones.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all shadow-md active:scale-95 truncate ${theme.btn}`}
              title={`Call ${phone}`}
            >
              <Phone className="h-3 w-3 shrink-0" />
              <span className="truncate">{phone}</span>
            </a>
          ))}
        </div>

        <button
          onClick={() => onCopy(c.phone, c.id)}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ink-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Copy phone number"
        >
          {copiedId === c.id ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
