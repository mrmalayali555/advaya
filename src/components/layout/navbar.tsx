"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar({
  searchConfig = { showMobile: true, showDesktop: true },
}: {
  searchConfig?: { showMobile: boolean; showDesktop: boolean };
} = {}) {
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
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Top scrim gradient on scroll to avoid text sticking out above floating pill */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#050208] via-[#050208]/80 to-transparent transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0"
        )}
      />
      <div className="relative z-50 mx-auto max-w-7xl px-3 sm:px-4 pt-3 sm:pt-4">
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-500 ease-brand border shadow-[var(--shadow-soft)]",
            scrolled
              ? "bg-[#0a0510]/90 backdrop-blur-xl border-[#7800ff]/15 shadow-[0_4px_30px_rgba(120,0,255,0.08)]"
              : "bg-transparent backdrop-blur-sm border-transparent"
          )}
        >
          <Link href="/" className="shrink-0" aria-label="ADVAYA home">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {(searchConfig.showMobile || searchConfig.showDesktop) && (
              <Link
                href="/search"
                aria-label="Search"
                className={cn(
                  "touch-target items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white",
                  searchConfig.showMobile && searchConfig.showDesktop
                    ? "flex"
                    : searchConfig.showMobile
                    ? "flex sm:hidden"
                    : "hidden sm:flex"
                )}
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </Link>
            )}
            <Link
              href="/complaints"
              className="hidden min-h-[44px] items-center rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_20px_-8px_rgba(120,0,255,0.4)] transition-all hover:-translate-y-0.5 hover:bg-purple-500 md:inline-flex"
            >
              Drop Suggestion
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="flex touch-target items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
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
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              ref={navRef}
              initial={{ y: prefersReduced ? 0 : -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: prefersReduced ? 0 : -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-x-3 top-20 max-h-[80vh] overflow-auto rounded-3xl border border-white/10 bg-surface-container shadow-2xl backdrop-blur-xl p-3"
            >
              {NAV_LINKS.map((link) => (
                <MobileLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={isActive(link.href)}
                  onClick={() => setOpen(false)}
                />
              ))}
              {searchConfig.showMobile && (
                <Link
                  href="/search"
                  onClick={() => setOpen(false)}
                  className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
                >
                  <Search className="h-4 w-4 text-purple-400" />
                  <span>Search anything...</span>
                </Link>
              )}
              <Link
                href="/complaints"
                onClick={() => setOpen(false)}
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
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "block rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors",
        active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
      )}
    >
      {label}
    </Link>
  );
}
