"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
        }),
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
        className="rounded-3xl border border-emerald-500/20 bg-emerald-900/30 p-10 text-center"
      >
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" strokeWidth={1.5} />
        <h3 className="mt-4 text-xl font-bold text-on-surface">Message sent</h3>
        <p className="mt-2 text-on-surface-variant">Thanks for reaching out — we&apos;ll get back to you soon.</p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="glass-card rounded-3xl p-6 shadow-[var(--shadow-card)] sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" placeholder="Your name" required />
        <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
      </div>
      <div className="mt-4">
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-on-surface-variant">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="How can we help?"
          className="w-full resize-y rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-on-surface outline-none transition-colors placeholder:text-white/40 focus:border-purple-400 focus:bg-white/15 focus:ring-2 focus:ring-purple-500/30"
        />
      </div>
      {error && (
        <p className="mt-4 rounded-xl border border-red-500/20 bg-red-900/30 px-4 py-3 text-sm text-red-400">{error}</p>
      )}
      <Button type="submit" size="lg" className="mt-6 w-full" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          "Send message"
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
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-on-surface-variant">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-on-surface outline-none transition-colors placeholder:text-white/40 focus:border-purple-400 focus:bg-white/15 focus:ring-2 focus:ring-purple-500/30"
      />
    </div>
  );
}
