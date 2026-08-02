"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Download,
  FileText,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  Printer,
  Copy,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";

interface PdfViewerModalProps {
  title: string;
  pdfUrl: string;
  filename?: string;
  onClose: () => void;
}

export function PdfViewerModal({
  title,
  pdfUrl,
  filename,
  onClose,
}: PdfViewerModalProps) {
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isFullscreen]);

  // Handle Download with direct blob fetch or a tag
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const downloadName = filename || title.replace(/[^a-zA-Z0-9_-]/g, "_") + ".pdf";
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = downloadName.endsWith(".pdf") ? downloadName : `${downloadName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Direct download failed, falling back to URL download", err);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = filename || "document.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
        return;
      } catch (e) {
        console.warn("Direct iframe print blocked by CORS, opening print window", e);
      }
    }
    const win = window.open(pdfUrl, "_blank");
    win?.focus();
    win?.print();
  };

  const handleCopyLink = () => {
    const fullUrl = pdfUrl.startsWith("http")
      ? pdfUrl
      : `${window.location.origin}${pdfUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const resetZoom = () => setZoom(100);
  const rotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-2 sm:p-4 md:p-6 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-[#0d0714] shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
          isFullscreen
            ? "fixed inset-2 sm:inset-4 z-[101] max-h-none max-w-none"
            : "h-full max-h-[92vh] w-full max-w-6xl"
        }`}
      >
        {/* Top App Bar / Document Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-surface-container-high/80 px-4 py-3 sm:px-6 sm:py-3.5 gap-2">
          {/* Document Title & Badge */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-xs sm:text-sm md:text-base font-bold text-on-surface">
                  {title}
                </h3>
                <span className="hidden sm:inline-flex rounded-md bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                  Built-in PDF Viewer
                </span>
              </div>
              <p className="text-[11px] text-ink-400 truncate hidden xs:block">
                Secure In-App Document Viewer & Downloader
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              title="Download Document"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white shadow-md shadow-purple-900/40 hover:opacity-90 active:scale-95 transition-all"
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span className="hidden xs:inline">Download</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              title="Print Document"
              className="hidden md:inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-ink-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              title="Copy PDF Link"
              className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-ink-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Link</span>
                </>
              )}
            </button>

            {/* Open in new tab fallback */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new browser tab"
              className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </a>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="hidden sm:inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              title="Close viewer"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-red-500/80 hover:text-white transition-colors"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Viewer Toolbar: Zoom / Rotate / Fit Controls */}
        <div className="flex items-center justify-between border-b border-white/10 bg-surface-container/60 px-4 py-2 text-xs text-ink-300">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={zoomOut}
              disabled={zoom <= 50}
              title="Zoom out"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={resetZoom}
              title="Reset Zoom"
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] font-mono font-medium transition-colors"
            >
              {zoom}%
            </button>
            <button
              onClick={zoomIn}
              disabled={zoom >= 200}
              title="Zoom in"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={rotate}
              title="Rotate 90°"
              className="hidden sm:flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 hover:bg-white/15 transition-colors ml-1"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-ink-400">
            <span className="hidden sm:inline">Use mouse wheel or pinch to zoom</span>
            <span className="sm:hidden font-mono">{zoom}%</span>
          </div>
        </div>

        {/* Main PDF Rendering Container */}
        <div className="relative flex-1 bg-[#1a1424] overflow-auto flex items-center justify-center p-2 sm:p-4">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0d0714]/80 backdrop-blur-sm gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 animate-pulse">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <p className="text-xs font-semibold text-on-surface">Loading Document...</p>
            </div>
          )}

          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-200 origin-center"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              maxWidth: zoom > 100 ? `${zoom}%` : "100%",
              maxHeight: zoom > 100 ? `${zoom}%` : "100%",
            }}
          >
            <iframe
              ref={iframeRef}
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              title={title}
              onLoad={() => setIsLoading(false)}
              className="h-full w-full rounded-xl border border-white/10 bg-white shadow-2xl"
            />
          </div>
        </div>

        {/* Bottom Status & Quick Action Bar */}
        <div className="flex items-center justify-between border-t border-white/10 bg-surface-container-high/60 px-4 py-2.5 sm:px-6 sm:py-3 text-xs">
          <span className="text-[11px] text-ink-400 truncate max-w-xs">
            {filename || title}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-ink-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 transition-colors shadow-sm"
            >
              <Download className="h-3 w-3" />
              <span>{isDownloading ? "Downloading..." : "Download Offline Copy"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
