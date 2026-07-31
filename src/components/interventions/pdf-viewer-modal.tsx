"use client";

import { useEffect } from "react";
import { X, Download, FileText, ExternalLink } from "lucide-react";

interface PdfViewerModalProps {
  title: string;
  pdfUrl: string;
  onClose: () => void;
}

export function PdfViewerModal({ title, pdfUrl, onClose }: PdfViewerModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-md">
      <div className="glass-card flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#140a23]/95 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-white/5">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-900/40 text-purple-300 border border-purple-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-on-surface">{title}</h3>
              <p className="text-xs text-on-surface-variant">Official Document Attachment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-purple-700"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </a>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 rounded-full border border-white/10 px-3.5 py-2 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open tab
            </a>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/40 hover:bg-white/10 hover:text-white"
              aria-label="Close PDF preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content iframe */}
        <div className="relative flex-1 bg-black/40">
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            title={title}
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
