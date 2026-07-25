import Link from "next/link";
import { LogoMark } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-surface px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="relative">
        <LogoMark className="mx-auto h-14 w-14" />
        <p className="mt-8 text-7xl font-extrabold text-gradient">404</p>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">Page not found</h1>
        <p className="mx-auto mt-2 max-w-md text-ink-500">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/" arrow>Back home</ButtonLink>
          <Link
            href="/search"
            className="inline-flex items-center rounded-full border border-ink-200 bg-white px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-purple-300 hover:text-purple-700"
          >
            Search
          </Link>
        </div>
      </div>
    </main>
  );
}
