"use client";

import { useState } from "react";
import { FileText, Upload, Trash2, ExternalLink, Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateEmergencyPdf, deleteEmergencyPdf } from "@/lib/actions/emergency";

interface PdfData {
  url: string;
  name: string;
}

export function EmergencyPdfUploader({ initialPdf }: { initialPdf: PdfData | null }) {
  const [pdf, setPdf] = useState<PdfData | null>(initialPdf);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage({ type: "error", text: "Only PDF files are supported." });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setMessage({ type: "error", text: "PDF size must be under 20 MB." });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload file");
      }

      await updateEmergencyPdf(data.url, file.name);
      setPdf({ url: data.url, name: file.name });
      setMessage({ type: "success", text: "Emergency Registry PDF uploaded & published successfully!" });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Failed to upload PDF." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove the Emergency Registry PDF? Public users will no longer see the PDF download option.")) {
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      await deleteEmergencyPdf();
      setPdf(null);
      setMessage({ type: "success", text: "Emergency Registry PDF removed successfully." });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to delete PDF." });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-[var(--shadow-soft)] space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-ink-900 text-sm">Official Emergency PDF Registry</h3>
            <p className="text-xs text-ink-500">
              Attach, update, or remove the official printable directory for students & staff
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs font-medium ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {pdf ? (
        <div className="rounded-xl border border-ink-200 bg-ink-50/50 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 border border-red-200">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink-900 truncate">{pdf.name}</p>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Live on Emergency page
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100 transition-colors shadow-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View</span>
              </a>
              <a
                href={pdf.url}
                download={pdf.name}
                className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100 transition-colors shadow-sm"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </a>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                <span>Delete PDF</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-ink-200/60 flex items-center justify-between gap-3 text-xs">
            <span className="text-ink-500">Need to replace with a new version?</span>
            <label className="cursor-pointer inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold underline">
              <Upload className="h-3 w-3" />
              <span>{isUploading ? "Uploading..." : "Upload Replacement PDF"}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={isUploading}
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/40 p-6 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-100 text-ink-400 mx-auto">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-800">No Registry PDF Attached</p>
            <p className="text-xs text-ink-500 mt-0.5">
              Upload the official Emergency Registry PDF file (max 20 MB)
            </p>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 transition-colors shadow-sm shadow-purple-200">
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>{isUploading ? "Uploading..." : "Select & Upload PDF"}</span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              disabled={isUploading}
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}
    </div>
  );
}
