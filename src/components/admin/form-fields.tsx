"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { Loader2, Upload, X, FileText, Trash2, Crop } from "lucide-react";
import { ImageCropperModal } from "./image-cropper-modal";

import { CyberLoader } from "@/components/ui/cyber-loader";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-800 outline-none transition-colors placeholder:text-ink-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100";


export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  required,
  hint,
  list,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
  list?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        list={list}
        step={type === "number" ? "any" : undefined}
        className={inputCls}
      />
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  rows = 5,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={inputCls + " resize-y"}
      />
    </div>
  );
}

export function Select({
  label,
  name,
  options,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink-700">
        {label}
      </label>
      <select id={name} name={name} defaultValue={defaultValue} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

export function Toggle({
  label,
  name,
  defaultChecked = true,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-200 px-4 py-3">
      <div>
        <div className="text-sm font-medium text-ink-700">{label}</div>
        {hint && <div className="text-xs text-ink-400">{hint}</div>}
      </div>
      <input type="hidden" name={name} value={on ? "on" : ""} />
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-purple-600" : "bg-ink-200"}`}
        aria-pressed={on}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

/** Single-file upload that stores the resulting URL in a hidden input. */
export function UploadField({
  label,
  name,
  defaultUrl,
  accept = "image/*",
  hint,
  enableCrop = false,
}: {
  label: string;
  name: string;
  defaultUrl?: string | null;
  accept?: string;
  hint?: string;
  enableCrop?: boolean;
}) {
  const [url, setUrl] = useState(defaultUrl || "");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [cropperRawSrc, setCropperRawSrc] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState("photo.jpg");

  useEffect(() => {
    setUrl(defaultUrl || "");
  }, [defaultUrl]);

  const isPdf = url.toLowerCase().endsWith(".pdf");

  async function compressImage(file: File): Promise<File> {
    if (!file.type.startsWith("image/") || file.type.includes("gif")) return file;
    return new Promise((resolve) => {
      const img = document.createElement("img");
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        const max = 1920;
        if (width > max || height > max) {
          if (width > height) {
            height = Math.round((height * max) / width);
            width = max;
          } else {
            width = Math.round((width * max) / height);
            height = max;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" }));
          },
          "image/jpeg",
          0.85
        );
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  }

  async function handleFile(rawFile: File) {
    setBusy(true);
    setError(null);
    setProgress(0);
    try {
      const file = await compressImage(rawFile);
      
      const data = await new Promise<any>((resolve, reject) => {
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
          try {
            const d = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(d);
            } else {
              reject(new Error(d.error || "Upload failed."));
            }
          } catch {
            reject(new Error("Upload failed."));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));
        
        xhr.open("POST", "/api/admin/upload");
        xhr.send(fd);
      });

      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  }

  const onSelectFile = (file: File) => {
    if (enableCrop && accept.includes("image")) {
      setOriginalFileName(file.name || "profile.jpg");
      const src = URL.createObjectURL(file);
      setCropperRawSrc(src);
    } else {
      handleFile(file);
    }
  };

  const handleCropComplete = (blob: Blob) => {
    setCropperRawSrc(null);
    const file = new File([blob], originalFileName, { type: "image/jpeg" });
    handleFile(file);
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-700">{label}</label>
      <input type="hidden" name={name} value={url} />

      {cropperRawSrc && (
        <ImageCropperModal
          imageSrc={cropperRawSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropperRawSrc(null)}
        />
      )}

      {url ? (
        <div className="relative overflow-hidden rounded-xl border border-ink-200">
          {isPdf ? (
            <div className="flex items-center gap-3 p-4">
              <FileText className="h-8 w-8 text-purple-500" />
              <span className="truncate text-sm text-ink-600">{url.split("/").pop()}</span>
            </div>
          ) : (
            <div className="relative aspect-[16/9] bg-ink-50">
              <Image src={url} alt="preview" fill className="object-contain" />
            </div>
          )}
          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            {enableCrop && !isPdf && (
              <button
                type="button"
                onClick={() => setCropperRawSrc(url)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-purple-700 shadow hover:bg-white"
                title="Recrop face"
              >
                <Crop className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setUrl("")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 shadow hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/50 px-4 py-8 text-center transition-colors hover:border-purple-300 hover:bg-purple-50/40">
          {busy ? (
            <CyberLoader progress={progress} />
          ) : (
            <>
              <Upload className="h-6 w-6 text-ink-400" />
              <span className="mt-2 text-sm font-medium text-ink-600">
                Click to upload
              </span>
              <span className="mt-0.5 text-xs text-ink-400">{hint || accept}</span>
            </>
          )}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                onSelectFile(f);
                e.target.value = "";
              }
            }}
          />
        </label>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function SubmitBtn({ children = "Save" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(91,42,134,0.39)] transition-all hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-[0_6px_20px_rgba(91,42,134,0.23)] disabled:opacity-60 sm:w-auto"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function DeleteBtn({ label = "Delete" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm("Are you sure? This cannot be undone.")) e.preventDefault();
      }}
      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 sm:w-auto"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {label}
    </button>
  );
}

export function IconDeleteBtn({ className }: { className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm("Are you sure you want to delete this media? This cannot be undone.")) e.preventDefault();
      }}
      className={className || "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 shadow hover:bg-white"}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}

