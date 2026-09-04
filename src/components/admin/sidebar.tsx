"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Trophy,
  CalendarDays,
  Bell,
  Wallet,
  MessageSquareWarning,
  Siren,
  Users,
  GraduationCap,
  FileText,
  Megaphone,
  Settings,
  Images,
  Mail,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ClipboardList,
} from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { section: "Overview", items: [{ href: "/adminahnuok", label: "Dashboard", icon: LayoutDashboard }] },
  {
    section: "Content",
    items: [
      { href: "/adminahnuok/interventions", label: "Interventions", icon: FileText },
      { href: "/adminahnuok/events", label: "Events", icon: CalendarDays },
      { href: "/adminahnuok/registrations", label: "Registrations", icon: ClipboardList },
      { href: "/adminahnuok/achievements", label: "Achievements", icon: Trophy },
      { href: "/adminahnuok/notifications", label: "Notifications", icon: Bell },
      { href: "/adminahnuok/marquee", label: "Marquee", icon: Megaphone },
    ],
  },
  {
    section: "Modules",
    items: [
      { href: "/adminahnuok/emergency", label: "Emergency", icon: Siren },
      { href: "/adminahnuok/complaints", label: "Suggestions", icon: MessageSquareWarning },
      { href: "/adminahnuok/committees", label: "Subcommittees", icon: Users },
      { href: "/adminahnuok/pages", label: "Pages (About)", icon: GraduationCap },
    ],
  },
  {
    section: "Site",
    items: [
      { href: "/adminahnuok/media", label: "Media Library", icon: Images },
      { href: "/adminahnuok/sessions", label: "Active Sessions", icon: Users },
      { href: "/adminahnuok/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar({ admin }: { admin: { name: string; email: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <LogoMark className="h-8 w-8" />
        <div className="leading-none">
          <div className="text-sm font-bold tracking-[0.2em] text-ink-900">ADVAYA</div>
          <div className="text-[10px] font-medium tracking-wide text-ink-400">Admin Panel</div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {NAV.map((group) => (
          <div key={group.section}>
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-300">
              {group.section}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-purple-50 text-purple-700"
                        : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-ink-100 p-3">
        <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
            {admin.name.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-ink-900">{admin.name}</div>
            <div className="truncate text-xs text-ink-400">{admin.email}</div>
          </div>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50"
        >
          <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.75} /> View site
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} /> Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-100 bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <LogoMark className="h-7 w-7" />
          <span className="text-sm font-bold tracking-[0.18em] text-ink-900">ADVAYA</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex touch-target items-center justify-center rounded-lg text-ink-700 hover:bg-ink-100"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-ink-100 bg-white lg:block">
        {nav}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-ink-100 bg-white">
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
