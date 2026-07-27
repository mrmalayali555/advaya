"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div className="rounded-full bg-red-100 p-4 mb-6">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>
      
      <h2 className="mb-2 text-2xl font-bold text-ink-900 font-display">
        Something went wrong!
      </h2>
      
      <p className="mb-8 max-w-md text-ink-500">
        We encountered an unexpected error while loading this page. 
        {error.digest && (
          <span className="block mt-2 text-xs text-ink-400 font-mono">
            Error ID: {error.digest}
          </span>
        )}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-sm">
        <button
          onClick={() => reset()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-ink-800"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </button>

        <button
          onClick={() => router.back()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-5 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>

      <div className="mt-8">
        <Link 
          href="/adminahnuok"
          className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700"
        >
          <Home className="h-4 w-4" />
          Return to Dashboard Home
        </Link>
      </div>
    </div>
  );
}
