import { ArrowUpRight, Hammer, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { SITE } from "@/lib/site";

export function MaintenancePage() {
  return (
    <main className="maintenance-page min-h-screen overflow-hidden bg-[#050208] text-white">
      <meta name="robots" content="noindex, nofollow" />
      <div className="maintenance-grid" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-7 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between">
          <Logo variant="dark" />
          <span className="rounded-full border border-purple-200/20 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-100/70">
            Scheduled Maintenance
          </span>
        </header>

        <section className="relative flex flex-1 items-center py-16 lg:py-20">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] lg:gap-24">
            <div className="max-w-2xl">
              <p className="maintenance-reveal flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-purple-200/75">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                We&apos;re improving your experience
              </p>
              <h1 className="maintenance-reveal maintenance-reveal-delay mt-6 max-w-xl text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-white sm:text-7xl">
                Website Under Development
              </h1>
              <p className="maintenance-reveal maintenance-reveal-delay-2 mt-7 max-w-lg text-base leading-7 text-white/60 sm:text-lg">
                The Advaya College website is temporarily under maintenance while we make thoughtful improvements. We&apos;ll be back soon.
              </p>

              <div className="maintenance-reveal maintenance-reveal-delay-3 mt-10 flex items-center gap-4 text-sm text-white/50">
                <div className="h-px w-24 bg-gradient-to-r from-purple-300 to-purple-300/10 sm:w-36" />
                <span>Progress in motion</span>
              </div>
            </div>

            <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center" aria-label="Animated illustration of ongoing website development" role="img">
              <div className="maintenance-orbit absolute inset-[10%] rounded-full border border-purple-200/15" />
              <div className="maintenance-orbit maintenance-orbit-reverse absolute inset-[21%] rounded-full border border-purple-300/10" />
              <div className="absolute inset-[31%] rounded-full bg-purple-500/10 blur-3xl" />
              <div className="relative flex h-36 w-36 rotate-[-8deg] items-center justify-center rounded-[2rem] border border-white/15 bg-white/[0.08] shadow-[0_25px_80px_rgba(91,42,134,0.35)] backdrop-blur-xl sm:h-44 sm:w-44">
                <div className="absolute inset-4 rounded-[1.25rem] border border-purple-200/20" />
                <Hammer className="h-14 w-14 text-purple-200" strokeWidth={1.25} aria-hidden="true" />
              </div>
              <div className="maintenance-dot absolute right-[14%] top-[24%] h-3 w-3 rounded-full bg-purple-200 shadow-[0_0_20px_#ddb7ff]" />
              <div className="maintenance-dot maintenance-dot-delay absolute bottom-[22%] left-[17%] h-2 w-2 rounded-full bg-white/80 shadow-[0_0_16px_#fff]" />
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>{SITE.name} · {SITE.college}</span>
          <span className="inline-flex items-center gap-1.5">Crafting what comes next <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
        </footer>
      </div>
    </main>
  );
}
