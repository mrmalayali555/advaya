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
        className="rounded-3xl border border-emerald-500/20 bg-emerald-900/20 p-10 text-center"
      >
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" strokeWidth={1.5} />
        <h3 className="mt-4 text-xl font-bold text-white">Suggestion submitted</h3>
        <p className="mx-auto mt-2 max-w-md text-white/70">
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
    <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-surface-container p-6 shadow-xl sm:p-8">
      {/* Toggle */}
      <div className="flex rounded-full bg-white/5 p-1">
        <button
          type="button"
          onClick={() => setAnonymous(true)}
          className={cn(
            "flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
            anonymous ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white"
          )}
        >
          Anonymous
        </button>
        <button
          type="button"
          onClick={() => setAnonymous(false)}
          className={cn(
            "flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
            !anonymous ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white"
          )}
        >
          Named
        </button>
      </div>

      {anonymous && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-purple-900/30 border border-purple-500/20 px-4 py-3 text-sm text-purple-300">
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
            transition={{
              height: { duration: 0.22, ease: [0.32, 0.72, 0, 1] },
              opacity: { duration: 0.15, ease: [0.32, 0.72, 0, 1] },
            }}
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
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-white/70">
          Your suggestion
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Share your suggestion or concern in detail…"
          className="w-full resize-y rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-900/30 border border-red-500/20 px-4 py-3 text-sm text-red-400">{error}</p>
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
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-white/70">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
      />
    </div>
  );
}
