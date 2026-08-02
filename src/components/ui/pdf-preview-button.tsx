"use client";

import { useState } from "react";
import { FileText, Eye, Download } from "lucide-react";
import { PdfViewerModal } from "./pdf-viewer-modal";

interface PdfPreviewButtonProps {
  title: string;
  pdfUrl: string;
  filename?: string;
  label?: string;
  variant?: "primary" | "outline" | "card";
  className?: string;
}

export function PdfPreviewButton({
  title,
  pdfUrl,
  filename,
  label = "View Attached PDF",
  variant = "primary",
  className = "",
}: PdfPreviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {variant === "card" ? (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5 backdrop-blur-md ${className}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-on-surface truncate">{title}</h4>
              <p className="text-xs text-on-surface-variant">Official PDF Attachment</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 transition-all shadow-md shadow-purple-950/40 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View in App</span>
            </button>
            <a
              href={pdfUrl}
              download={filename || `${title}.pdf`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </a>
          </div>
        </div>
      ) : variant === "outline" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-on-surface hover:bg-white/10 transition-all cursor-pointer ${className}`}
        >
          <FileText className="h-4 w-4 text-purple-400" />
          <span>{label}</span>
          <Eye className="h-3.5 w-3.5 opacity-60 ml-auto" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-purple-950/40 hover:opacity-95 transition-all active:scale-95 cursor-pointer ${className}`}
        >
          <FileText className="h-5 w-5" />
          <span>{label}</span>
          <Eye className="h-4 w-4 opacity-80" />
        </button>
      )}

      {isOpen && (
        <PdfViewerModal
          title={title}
          pdfUrl={pdfUrl}
          filename={filename}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
