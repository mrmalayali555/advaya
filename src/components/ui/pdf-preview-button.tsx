"use client";

import { FileText, ExternalLink, Download } from "lucide-react";

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
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 transition-all shadow-md shadow-purple-950/40 cursor-pointer active:scale-95"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open PDF</span>
            </a>
            <a
              href={pdfUrl}
              download={filename || `${title}.pdf`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all cursor-pointer active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </a>
          </div>
        </div>
      ) : variant === "outline" ? (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-on-surface hover:bg-white/10 transition-all cursor-pointer active:scale-95 ${className}`}
        >
          <FileText className="h-4 w-4 text-purple-400" />
          <span>{label}</span>
          <ExternalLink className="h-3.5 w-3.5 opacity-60 ml-auto" />
        </a>
      ) : (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-purple-950/40 hover:opacity-95 transition-all active:scale-95 cursor-pointer ${className}`}
        >
          <FileText className="h-5 w-5" />
          <span>{label}</span>
          <ExternalLink className="h-4 w-4 opacity-80" />
        </a>
      )}
    </>
  );
}
