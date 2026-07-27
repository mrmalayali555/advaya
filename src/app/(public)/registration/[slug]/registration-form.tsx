"use client";

import { useState, FormEvent } from "react";
import { UploadIcon, Loader2Icon, CheckCircleIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

type Field = {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string | null;
  options: string | null;
};

export default function RegistrationForm({ 
  formId, 
  fields, 
  title, 
  eventSlug 
}: { 
  formId: string;
  fields: Field[];
  title: string;
  eventSlug?: string | null;
}) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleTextChange = (id: string, val: string) => setFormData(prev => ({ ...prev, [id]: val }));
  const handleCheckChange = (id: string, checked: boolean) => setFormData(prev => ({ ...prev, [id]: checked }));
  const handleFileChange = (id: string, file: File | null) => {
    if (file) {
      setFiles(prev => ({ ...prev, [id]: file }));
    } else {
      const newFiles = { ...files };
      delete newFiles[id];
      setFiles(newFiles);
    }
  };

  const uploadFile = async (file: File) => {
    const response = await fetch(`/api/registration/upload?filename=${encodeURIComponent(file.name)}`, {
      method: "POST",
      body: file,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to upload file");
    }
    const blob = await response.json();
    return blob.url;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // 1. Upload files
      const fileUrls: Record<string, string> = {};
      for (const [id, file] of Object.entries(files)) {
        fileUrls[id] = await uploadFile(file);
      }

      // 2. Submit form
      const res = await fetch("/api/registration/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId,
          data: formData,
          files: fileUrls,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-soft text-center max-w-lg mx-auto border border-ink-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-ink-900 mb-3">Registration Successful</h2>
        <p className="text-ink-600 mb-8">Thank you for registering for {title}. Your response has been recorded.</p>
        
        {eventSlug ? (
          <Link href={`/events/${eventSlug}`} className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-ink-800">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Event
          </Link>
        ) : (
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-700 shadow-sm transition-colors hover:bg-ink-50">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Home
          </Link>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800 border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-semibold text-ink-900">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === "text" || field.type === "email" || field.type === "tel" || field.type === "number" || field.type === "url" ? (
              <input
                type={field.type}
                required={field.required}
                placeholder={field.placeholder || ""}
                onChange={(e) => handleTextChange(field.id, e.target.value)}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all"
              />
            ) : field.type === "textarea" ? (
              <textarea
                required={field.required}
                placeholder={field.placeholder || ""}
                onChange={(e) => handleTextChange(field.id, e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all"
              />
            ) : field.type === "select" ? (
              <select
                required={field.required}
                onChange={(e) => handleTextChange(field.id, e.target.value)}
                defaultValue=""
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all"
              >
                <option value="" disabled>Select an option</option>
                {field.options?.split(",").map((opt) => (
                  <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                ))}
              </select>
            ) : field.type === "checkbox" ? (
              field.options ? (
                <div className="space-y-3 pt-1">
                  {field.options.split(",").map((opt) => (
                    <label key={opt.trim()} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required={field.required && (!formData[field.id] || formData[field.id].length === 0)}
                        onChange={(e) => {
                          setFormData((prev) => {
                            const current = Array.isArray(prev[field.id]) ? prev[field.id] : [];
                            if (e.target.checked) return { ...prev, [field.id]: [...current, opt.trim()] };
                            return { ...prev, [field.id]: current.filter((v: string) => v !== opt.trim()) };
                          });
                        }}
                        className="h-5 w-5 rounded border-ink-200 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-ink-700">{opt.trim()}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required={field.required}
                    onChange={(e) => handleCheckChange(field.id, e.target.checked)}
                    className="h-5 w-5 rounded border-ink-200 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-ink-700">{field.placeholder || "Yes, I agree"}</span>
                </label>
              )
            ) : field.type === "file" ? (
              <div className="relative">
                <input
                  type="file"
                  required={field.required}
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
                  className="hidden"
                  id={`file-${field.id}`}
                />
                <label
                  htmlFor={`file-${field.id}`}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 bg-ink-50 px-4 py-6 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
                >
                  <UploadIcon className="h-5 w-5" />
                  {files[field.id] ? files[field.id].name : field.placeholder || "Upload a file (JPG, PNG, PDF)"}
                </label>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-4 text-sm font-bold text-white shadow-soft transition-all hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2Icon className="h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Registration"
        )}
      </button>
    </form>
  );
}
