"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, Move, Check, X, RotateCw } from "lucide-react";

interface ImageCropperModalProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export function ImageCropperModal({
  imageSrc,
  onCropComplete,
  onCancel,
}: ImageCropperModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      setLoaded(true);
    };
  }, [imageSrc]);

  // Render preview canvas
  useEffect(() => {
    if (!loaded || !imageRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 320;
    canvas.width = size;
    canvas.height = size;

    const img = imageRef.current;
    ctx.clearRect(0, 0, size, size);

    ctx.save();
    // Center of canvas
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Calculate scale to fit initially
    const minDim = Math.min(img.width, img.height);
    const baseScale = size / minDim;
    const currentScale = baseScale * zoom;

    const drawWidth = img.width * currentScale;
    const drawHeight = img.height * currentScale;

    ctx.drawImage(
      img,
      -drawWidth / 2 + offset.x,
      -drawHeight / 2 + offset.y,
      drawWidth,
      drawHeight
    );
    ctx.restore();
  }, [loaded, zoom, offset, rotation]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleCropSave = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;

    // Export a high resolution cropped square (500x500)
    const exportCanvas = document.createElement("canvas");
    const exportSize = 500;
    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.translate(exportSize / 2, exportSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    const previewSize = 320;
    const scaleFactor = exportSize / previewSize;

    const minDim = Math.min(img.width, img.height);
    const baseScale = previewSize / minDim;
    const currentScale = baseScale * zoom * scaleFactor;

    const drawWidth = img.width * currentScale;
    const drawHeight = img.height * currentScale;

    ctx.drawImage(
      img,
      -drawWidth / 2 + offset.x * scaleFactor,
      -drawHeight / 2 + offset.y * scaleFactor,
      drawWidth,
      drawHeight
    );
    ctx.restore();

    exportCanvas.toBlob(
      (blob) => {
        if (blob) onCropComplete(blob);
      },
      "image/jpeg",
      0.92
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-ink-100 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink-900">Crop Profile Photo</h3>
          <button
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 hover:bg-ink-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-xs text-ink-500">
          Drag to center the face inside the circle. Use the slider to zoom in or out.
        </p>

        {/* Cropper Container */}
        <div className="relative mx-auto flex h-[320px] w-[320px] items-center justify-center overflow-hidden rounded-2xl bg-ink-950 shadow-inner">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="cursor-move touch-none"
          />
          {/* Circular mask overlay (WhatsApp style) */}
          <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.6)]" />
          <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            <Move className="h-3 w-3" /> Drag face to fit
          </div>
        </div>

        {/* Zoom & Rotation controls */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3">
            <ZoomOut className="h-4 w-4 text-ink-400" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-ink-200 accent-purple-600"
            />
            <ZoomIn className="h-4 w-4 text-ink-400" />
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50"
              title="Rotate 90deg"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-ink-200 px-5 py-2 text-sm font-semibold text-ink-600 hover:bg-ink-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCropSave}
            className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700"
          >
            <Check className="h-4 w-4" /> Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
}
