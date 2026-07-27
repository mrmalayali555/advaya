"use client";

import { DownloadIcon, LinkIcon } from "lucide-react";
import { useState } from "react";

export function QRCodeDisplay({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&margin=10`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `qr-code-${new URL(url).pathname.split('/').pop()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-4">
      <div className="rounded-xl border border-ink-200 p-4 bg-white shadow-sm overflow-hidden inline-block">
        <img src={qrUrl} alt="QR Code" className="w-40 h-40 object-contain" crossOrigin="anonymous" />
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 shadow-sm transition-colors hover:bg-ink-50"
        >
          <LinkIcon className="h-4 w-4" />
          {copied ? "Copied!" : "Copy Link"}
        </button>
        <button
          onClick={handleDownload}
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700"
        >
          <DownloadIcon className="h-4 w-4" />
          Download PNG
        </button>
      </div>
    </div>
  );
}
