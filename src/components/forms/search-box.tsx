"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useTransition } from "react";
import { Search, X, Loader2 } from "lucide-react";

export function SearchBox({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      startTransition(() => {
        const trimmed = q.trim();
        if (trimmed) {
          router.replace(`/search?q=${encodeURIComponent(trimmed)}`, {
            scroll: false,
          });
        } else {
          router.replace("/search", { scroll: false });
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [q, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-400">
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
        ) : (
          <Search className="h-5 w-5" />
        )}
      </div>

      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search anything... events, directory, pages…"
        className="w-full rounded-full border border-ink-200 bg-white py-4 pl-14 pr-36 text-ink-800 shadow-[var(--shadow-soft)] outline-none transition-all placeholder:text-ink-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
      />

      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              startTransition(() => {
                router.replace("/search", { scroll: false });
              });
            }}
            aria-label="Clear search"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className="rounded-full bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-purple-700 active:scale-95"
        >
          Search
        </button>
      </div>
    </form>
  );
}
