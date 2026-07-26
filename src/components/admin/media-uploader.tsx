"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { CyberLoader } from "@/components/ui/cyber-loader";

export function MediaUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    setBusy(true);
    setError(null);
    setProgress(0);

    try {
      for (const file of Array.from(files)) {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const fd = new FormData();
          fd.append("file", file);

          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const p = Math.round((event.loaded / event.total) * 100);
              setProgress(p);
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              try {
                const data = JSON.parse(xhr.responseText);
                reject(new Error(data.error || "Upload failed."));
              } catch {
                reject(new Error("Upload failed."));
              }
            }
          });

          xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));
          
          xhr.open("POST", "/api/admin/upload");
          xhr.send(fd);
        });
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  }

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-200 bg-white px-4 py-10 text-center transition-colors hover:border-purple-300 hover:bg-purple-50/40">
        {busy ? (
          <CyberLoader progress={progress} />
        ) : (
          <>
            <Upload className="h-7 w-7 text-ink-400" />
            <span className="mt-3 text-sm font-semibold text-ink-700">
              Click to upload images, videos or PDFs
            </span>
          </>
        )}
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

