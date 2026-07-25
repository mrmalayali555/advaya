"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ComplaintForm() {
  const [anonymous, setAnonymous] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    const payload = {
      anonymous,
      name: (form.get("name") as string) || "",
      email: (form.get("email") as string) || "",
      message: (form.get("message") as string) || "",
    };
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-10 text-center"
      >
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" strokeWidth={1.5} />
        <h3 className="mt-4 text-xl font-bold text-ink-900">Suggestion submitted</h3>
        <p className="mx-auto mt-2 max-w-md text-ink-500">
          Thank you for speaking up. The union has received your suggestion and will
          look into it. {anonymous && "Your identity was not recorded."}
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-purple-600 hover:underline"
        >
          Submit another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-ink-100 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
      {/* Toggle */}
      <div className="flex rounded-full bg-ink-100 p-1">
        <button
          type="button"
          onClick={() => setAnonymous(true)}
          className={cn(
            "flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
            anonymous ? "bg-white text-purple-700 shadow-sm" : "text-ink-500"
          )}
        >
          Anonymous
        </button>
        <button
          type="button"
          onClick={() => setAnonymous(false)}
          className={cn(
            "flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
            !anonymous ? "bg-white text-purple-700 shadow-sm" : "text-ink-500"
          )}
        >
          Named
        </button>
      </div>

      {anonymous && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-purple-50 px-4 py-3 text-sm text-purple-700">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          Your name and email will not be stored. Fully anonymous.
        </div>
      )}

      <AnimatePresence initial={false}>
        {!anonymous && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 pt-5 sm:grid-cols-2">
              <Field label="Name" name="name" placeholder="Your name" />
              <Field label="Email" name="email" type="email" placeholder="you@example.com" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5">
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-700">
          Your suggestion
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Share your suggestion or concern in detail…"
          className="w-full resize-y rounded-2xl border border-ink-200 bg-surface px-4 py-3 text-ink-800 outline-none transition-colors placeholder:text-ink-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
          </>
        ) : (
          "Submit suggestion"
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-ink-200 bg-surface px-4 py-3 text-ink-800 outline-none transition-colors placeholder:text-ink-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
      />
    </div>
  );
}
