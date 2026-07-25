"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2 } from "lucide-react";

export function MediaUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || "Upload failed.");
        }
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-200 bg-white px-4 py-10 text-center transition-colors hover:border-purple-300 hover:bg-purple-50/40">
        {busy ? (
          <Loader2 className="h-7 w-7 animate-spin text-purple-500" />
        ) : (
          <Upload className="h-7 w-7 text-ink-400" />
        )}
        <span className="mt-3 text-sm font-semibold text-ink-700">
          {busy ? "Uploading…" : "Click to upload images, videos or PDFs"}
        </span>
        <span className="mt-1 text-xs text-ink-400">You can select multiple files</span>
        <input
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
