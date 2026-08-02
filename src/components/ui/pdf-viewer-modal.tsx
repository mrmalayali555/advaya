"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  ChevronLeft,
  ChevronRight,
  Printer,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface PdfViewerModalProps {
  title: string;
  pdfUrl: string;
  filename?: string;
  onClose: () => void;
}

// Dynamically load Mozilla PDF.js from CDN
async function getPdfJs(): Promise<any> {
  if (typeof window === "undefined") return null;
  if ((window as any).pdfjsLib) {
    return (window as any).pdfjsLib;
  }

  return new Promise((resolve, reject) => {
    // Check if already in DOM
    const existingScript = document.getElementById("pdfjs-cdn-script");
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if ((window as any).pdfjsLib) {
          clearInterval(checkInterval);
          resolve((window as any).pdfjsLib);
        }
      }, 50);
      setTimeout(() => {
        clearInterval(checkInterval);
        if ((window as any).pdfjsLib) resolve((window as any).pdfjsLib);
        else reject(new Error("Timeout loading PDF.js"));
      }, 5000);
      return;
    }

    const script = document.createElement("script");
    script.id = "pdfjs-cdn-script";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;

    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(pdfjs);
      } else {
        reject(new Error("pdfjsLib not available on window"));
      }
    };

    script.onerror = () => {
      reject(new Error("Failed to load PDF.js script"));
    };

    document.head.appendChild(script);
  });
}

export function PdfViewerModal({
  title,
  pdfUrl,
  filename,
  onClose,
}: PdfViewerModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState<number>(1.1);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const renderTasks = useRef<{ [pageIndex: number]: any }>({});

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isFullscreen]);

  // Adjust initial scale based on viewport width
  useEffect(() => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) {
        setScale(0.85); // Mobile fit
      } else if (width < 1024) {
        setScale(1.0);
      } else {
        setScale(1.2);
      }
    }
  }, []);

  // Load PDF Document
  const loadDocument = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pdfjs = await getPdfJs();
      if (!pdfjs) throw new Error("Could not initialize PDF renderer");

      const loadingTask = pdfjs.getDocument({
        url: pdfUrl,
        cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
        cMapPacked: true,
      });

      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setCurrentPage(1);
    } catch (err: any) {
      console.error("PDF Load Error:", err);
      setError(
        err.message ||
          "Unable to render PDF inside the app. You can still download the document directly below."
      );
    } finally {
      setLoading(false);
    }
  }, [pdfUrl]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  // Render a specific page onto its canvas
  const renderPage = useCallback(
    async (pageNumber: number) => {
      if (!pdfDoc) return;
      const canvas = canvasRefs.current[pageNumber - 1];
      if (!canvas) return;

      try {
        // Cancel ongoing render task for this page if any
        if (renderTasks.current[pageNumber]) {
          try {
            renderTasks.current[pageNumber].cancel();
          } catch (_) {}
        }

        const page = await pdfDoc.getPage(pageNumber);
        const dpr = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: scale, rotation: rotation });

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
        ctx.scale(dpr, dpr);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTasks.current[pageNumber] = renderTask;
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.warn(`Render error on page ${pageNumber}:`, err);
        }
      }
    },
    [pdfDoc, scale, rotation]
  );

  // Render all pages whenever pdfDoc, scale, or rotation changes
  useEffect(() => {
    if (!pdfDoc || numPages === 0) return;
    for (let i = 1; i <= numPages; i++) {
      renderPage(i);
    }
  }, [pdfDoc, numPages, scale, rotation, renderPage]);

  // Handle Download with direct blob or fallback
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
      console.error("Blob download failed, using standard link:", err);
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

  const zoomIn = () => setScale((prev) => Math.min(Number((prev + 0.2).toFixed(1)), 2.5));
  const zoomOut = () => setScale((prev) => Math.max(Number((prev - 0.2).toFixed(1)), 0.5));
  const resetZoom = () => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setScale(0.85);
    } else {
      setScale(1.1);
    }
  };
  const rotate = () => setRotation((prev) => (prev + 90) % 360);

  const scrollToPage = (pageNum: number) => {
    const targetCanvas = canvasRefs.current[pageNum - 1];
    if (targetCanvas && containerRef.current) {
      targetCanvas.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-[#0b0612] shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
          isFullscreen
            ? "fixed inset-0 sm:inset-2 z-[101] max-h-none max-w-none rounded-none sm:rounded-2xl"
            : "h-[92vh] w-full max-w-5xl"
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-surface-container-high/90 px-3 py-2.5 sm:px-5 sm:py-3 gap-2">
          {/* Document Info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="truncate text-xs sm:text-sm md:text-base font-bold text-on-surface">
                  {title}
                </h3>
                {numPages > 0 && (
                  <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-purple-300 shrink-0">
                    {numPages} {numPages === 1 ? "page" : "pages"}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-ink-400 truncate hidden xs:block">
                Native In-App Document Canvas Viewer
              </p>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Direct Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              title="Download Document"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-950/40 hover:opacity-90 active:scale-95 transition-all"
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Print */}
            <button
              type="button"
              onClick={handlePrint}
              title="Print Document"
              className="hidden md:inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-ink-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
            </button>

            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy Document Link"
              className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-ink-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>

            {/* Fullscreen toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              title="Close viewer"
              className="flex h-8 w-8 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-red-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {/* Secondary Controls: Zoom / Rotate / Page Jump */}
        <div className="flex items-center justify-between border-b border-white/10 bg-surface-container/70 px-3 py-1.5 sm:px-5 sm:py-2 text-xs text-ink-300 gap-2">
          {/* Zoom & Rotation controls */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={zoomOut}
              disabled={scale <= 0.5}
              title="Zoom Out"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 transition-colors"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              title="Reset Zoom to Fit"
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] font-mono font-medium transition-colors"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={zoomIn}
              disabled={scale >= 2.5}
              title="Zoom In"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 transition-colors"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={rotate}
              title="Rotate 90°"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 hover:bg-white/15 transition-colors ml-0.5"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Page Selector Navigation */}
          {numPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollToPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage <= 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1">
                Page {currentPage} of {numPages}
              </span>
              <button
                type="button"
                onClick={() => scrollToPage(Math.min(currentPage + 1, numPages))}
                disabled={currentPage >= numPages}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Document Canvas Container */}
        <div
          ref={containerRef}
          className="relative flex-1 bg-[#150e20] overflow-y-auto overflow-x-auto p-3 sm:p-6 flex flex-col items-center gap-4 sm:gap-6 touch-pan-y"
          style={{ overscrollBehavior: "contain" }}
        >
          {/* Loading Indicator */}
          {loading && (
            <div className="my-auto flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 animate-pulse">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">Rendering Document Pages...</p>
                <p className="text-xs text-ink-400 mt-0.5">
                  Preparing high-resolution in-browser preview
                </p>
              </div>
            </div>
          )}

          {/* Error Message with Fallback Download */}
          {error && !loading && (
            <div className="my-auto max-w-md rounded-2xl border border-red-500/30 bg-red-950/40 p-6 text-center space-y-4 backdrop-blur-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 mx-auto">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-on-surface text-sm">Preview Notice</h4>
                <p className="text-xs text-ink-300 mt-1">{error}</p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={loadDocument}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Retry</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 transition-all shadow-md shadow-purple-950/40"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          )}

          {/* Rendered Canvas Pages Stack */}
          {!loading && !error && numPages > 0 && (
            <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
              {Array.from({ length: numPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <div
                    key={pageNum}
                    className="flex flex-col items-center group relative"
                  >
                    {/* Page Label Tag */}
                    <div className="mb-1.5 flex items-center gap-2 text-[10px] font-mono text-ink-400 select-none">
                      <span>
                        Page {pageNum} of {numPages}
                      </span>
                    </div>

                    {/* Canvas Paper Sheet */}
                    <div className="overflow-hidden rounded-lg sm:rounded-xl shadow-2xl border border-white/10 bg-white transition-shadow duration-200 group-hover:shadow-purple-900/20">
                      <canvas
                        ref={(el) => {
                          canvasRefs.current[index] = el;
                        }}
                        className="block max-w-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Quick Action Bar */}
        <div className="flex items-center justify-between border-t border-white/10 bg-surface-container-high/80 px-3 py-2 sm:px-5 sm:py-2.5 text-xs">
          <span className="text-[11px] text-ink-400 truncate max-w-[200px] sm:max-w-xs">
            {filename || title}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-ink-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 transition-colors shadow-sm"
            >
              <Download className="h-3 w-3" />
              <span>{isDownloading ? "Downloading..." : "Download PDF"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
