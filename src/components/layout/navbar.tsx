"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open && navRef.current) {
      setTimeout(() => {
        if (!navRef.current) return;
        navRef.current.scrollTo({ top: navRef.current.scrollHeight, behavior: "smooth" });
      }, 600);
    }
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4 pt-3 sm:pt-4">
      <div className="relative z-50 mx-auto max-w-7xl">
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-500 ease-brand border shadow-[var(--shadow-soft)]",
            scrolled
              ? "glass bg-white/90 border-ink-100"
              : "bg-white/70 backdrop-blur-md border-transparent"
          )}
        >
          <Link href="/" className="shrink-0" aria-label="ADVAYA home">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) =>
              "children" in link && link.children ? (
                <div key={link.label} className="group relative">
                  <button
                    className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-purple-700"
                    type="button"
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-[180px] rounded-2xl border border-ink-100 bg-white p-2 shadow-[var(--shadow-card)]">
                      {link.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="block rounded-xl px-3 py-2 text-sm text-ink-600 transition-colors hover:bg-purple-50 hover:text-purple-700"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-purple-50 text-purple-700"
                      : "text-ink-600 hover:text-purple-700"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="hidden touch-target items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-purple-700 sm:flex"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </Link>
            <Link
              href="/complaints"
              className="hidden min-h-[44px] items-center rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_20px_-8px_rgba(91,42,134,0.6)] transition-all hover:-translate-y-0.5 hover:bg-purple-700 md:inline-flex"
            >
              Drop Suggestion
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="flex touch-target items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-100 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-ink-900/20 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              ref={navRef}
              initial={{ y: prefersReduced ? 0 : -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: prefersReduced ? 0 : -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-x-3 top-20 max-h-[80vh] overflow-auto rounded-3xl border border-ink-100 bg-white p-3 shadow-[var(--shadow-lift)]"
            >
              {NAV_LINKS.flatMap((link) =>
                "children" in link && link.children
                  ? [
                      <div
                        key={link.label}
                        className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-400"
                      >
                        {link.label}
                      </div>,
                      ...link.children.map((c) => (
                        <MobileLink key={c.href} href={c.href} label={c.label} active={isActive(c.href)} />
                      )),
                    ]
                  : [
                      <MobileLink
                        key={link.href}
                        href={link.href}
                        label={link.label}
                        active={isActive(link.href)}
                      />,
                    ]
              )}
              <Link
                href="/complaints"
                className="mt-2 block rounded-2xl bg-purple-600 px-4 py-3.5 text-center text-sm font-semibold text-white"
              >
                Drop Suggestion
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors",
        active ? "bg-purple-50 text-purple-700" : "text-ink-700 hover:bg-ink-50"
      )}
    >
      {label}
    </Link>
  );
}
