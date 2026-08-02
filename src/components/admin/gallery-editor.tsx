"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Upload, X, Pencil, Save, Loader2, Trash2,
  ZoomIn, ZoomOut, Move, Bold, Italic, Underline,
  Heading1, Heading2, Palette, Type, RotateCw,
} from "lucide-react";
import { CyberLoader } from "@/components/ui/cyber-loader";
import { GalleryPhotoImg } from "@/components/ui/gallery-photo-img";

/* ─── Types ─── */
type Photo = { id: string; url: string; caption: string; position: number; zoom?: number; offsetX?: number; offsetY?: number; rotation?: number };
type GalleryData = {
  id: string;
  theme: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  blogText?: string | null;
  photos: Photo[];
  eventId: string;
};

/* ─── Slot configs per theme ─── */
const BOHEMIAN_SLOTS = [
  { label: "Top-left", rotate: "-6deg", style: { top: "2%", left: "2%", width: "22%" } },
  { label: "Top-center", rotate: "3deg", style: { top: "0%", left: "40%", width: "18%" } },
  { label: "Top-right", rotate: "5deg", style: { top: "3%", right: "2%", width: "20%" } },
  { label: "Bottom-left", rotate: "4deg", style: { bottom: "3%", left: "3%", width: "24%" } },
  { label: "Bottom-center", rotate: "-3deg", style: { bottom: "5%", left: "35%", width: "20%" } },
  { label: "Bottom-right", rotate: "-5deg", style: { bottom: "2%", right: "3%", width: "22%" } },
  { label: "Mid-left", rotate: "-8deg", style: { top: "30%", left: "0%", width: "18%" } },
];

const SCRAPBOOK_ROTATIONS = ["-3deg", "2deg", "-5deg", "4deg", "-2deg", "6deg", "-4deg", "3deg", "-1deg", "5deg"];
const TAPE_COLORS = ["bg-amber-200/80", "bg-pink-200/80", "bg-blue-200/80", "bg-green-200/80", "bg-purple-200/80", "bg-yellow-200/80"];

const CORK_ROTATIONS = ["-10deg", "15deg", "-25deg", "5deg", "5deg", "-8deg", "2deg", "-13deg", "-7deg", "2deg", "-3deg"];

/* ─── Photo upload slot ─── */
function PhotoSlot({
  photo,
  position,
  galleryId,
  aspectRatio = "3/4",
  captionFont = "font-sans",
  onPhotoAdded,
  onPhotoRemoved,
}: {
  photo?: Photo;
  position: number;
  galleryId: string;
  aspectRatio?: string;
  captionFont?: string;
  onPhotoAdded: (position: number, photo: Photo) => void;
  onPhotoRemoved: (position: number, photoId: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localPhoto, setLocalPhoto] = useState<Photo | undefined>(photo);
  const [caption, setCaption] = useState(photo?.caption || "");
  const [editingCaption, setEditingCaption] = useState(false);
  const [zoom, setZoom] = useState(photo?.zoom || 1);
  const [offsetX, setOffsetX] = useState(photo?.offsetX || 0);
  const [offsetY, setOffsetY] = useState(photo?.offsetY || 0);
  const [rotation, setRotation] = useState(photo?.rotation || 0);
  const [showZoom, setShowZoom] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Sync from parent
  if (photo && !localPhoto) setLocalPhoto(photo);
  if (photo && localPhoto && photo.id !== localPhoto.id) setLocalPhoto(photo);

  async function handleUpload(file: File) {
    setUploading(true);
    setProgress(0);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const data: { url: string; error?: string } = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener("load", () => {
          try {
            const d = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) resolve(d);
            else reject(new Error(d.error || "Upload failed"));
          } catch { reject(new Error("Upload failed")); }
        });
        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.open("POST", "/api/admin/upload");
        xhr.send(fd);
      });

      // Save to gallery
      const res = await fetch("/api/admin/gallery-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ galleryId, position, url: data.url, caption: "" }),
      });
      if (res.ok) {
        const result = await res.json();
        const newPhoto: Photo = {
          id: result.photo?.id || `temp-${Date.now()}`,
          url: data.url,
          caption: "",
          position,
        };
        setLocalPhoto(newPhoto);
        onPhotoAdded(position, newPhoto);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  async function handleRemove() {
    const p = localPhoto || photo;
    if (!p) return;
    await fetch("/api/admin/gallery-photo", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId: p.id }),
    });
    setLocalPhoto(undefined);
    onPhotoRemoved(position, p.id);
  }

  async function saveCaption() {
    const p = localPhoto || photo;
    if (!p) return;
    await fetch("/api/admin/gallery-photo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId: p.id, caption }),
    });
    setEditingCaption(false);
  }

  const displayPhoto = localPhoto || photo;

  if (displayPhoto) {
    return (
      <div className="relative">
        <GalleryPhotoImg
          src={displayPhoto.url}
          alt={displayPhoto.caption || ""}
          aspectRatio={aspectRatio}
          zoom={zoom}
          offsetX={offsetX}
          offsetY={offsetY}
          rotation={rotation}
        >
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all hover:bg-black/40 hover:opacity-100 z-10">
            <button
              onClick={() => setShowZoom((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-purple-600 shadow hover:scale-105"
              title="Edit photo (zoom, rotate, position)"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={async () => {
                const nextRot = (rotation + 90) % 360;
                setRotation(nextRot);
                const p = localPhoto || photo;
                if (p) {
                  await fetch("/api/admin/gallery-photo", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ photoId: p.id, caption, zoom, offsetX, offsetY, rotation: nextRot }),
                  });
                }
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-blue-600 shadow hover:scale-105"
              title="Rotate 90°"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleRemove}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 shadow hover:scale-105"
              title="Remove photo"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </GalleryPhotoImg>
        {/* Transform controls positioned below image so it does not overlay or cover buttons */}
        {showZoom && (
          <div className="mt-2 flex flex-col gap-2 rounded-lg bg-ink-900 p-2.5 text-white shadow-md">
            <div className="flex items-center gap-2">
              <ZoomOut className="h-3.5 w-3.5 text-ink-300" />
              <input
                type="range" min="1" max="3" step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-purple-400"
              />
              <ZoomIn className="h-3.5 w-3.5 text-ink-300" />
              <span className="w-8 text-right text-xs text-ink-200">{zoom.toFixed(1)}x</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCw className="h-3.5 w-3.5 text-ink-300" />
              <input
                type="range" min="-180" max="180" step="1"
                value={rotation > 180 ? rotation - 360 : (rotation < -180 ? rotation + 360 : rotation)}
                onChange={(e) => setRotation(parseFloat(e.target.value))}
                className="flex-1 accent-blue-400"
              />
              <span className="w-8 text-right text-xs text-ink-200">{Math.round(rotation)}°</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <button onClick={() => setOffsetX(x => x - 5)} className="px-1.5 py-0.5 text-xs bg-white/10 hover:bg-white/20 rounded">←</button>
                <button onClick={() => setOffsetX(x => x + 5)} className="px-1.5 py-0.5 text-xs bg-white/10 hover:bg-white/20 rounded">→</button>
                <button onClick={() => setOffsetY(y => y - 5)} className="px-1.5 py-0.5 text-xs bg-white/10 hover:bg-white/20 rounded">↑</button>
                <button onClick={() => setOffsetY(y => y + 5)} className="px-1.5 py-0.5 text-xs bg-white/10 hover:bg-white/20 rounded">↓</button>
              </div>
              <button 
                onClick={async () => {
                  const p = localPhoto || photo;
                  if (p) {
                    await fetch("/api/admin/gallery-photo", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ photoId: p.id, zoom, offsetX, offsetY, rotation }),
                    });
                  }
                  setShowZoom(false);
                }} 
                className="rounded bg-purple-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-purple-500"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {editingCaption ? (
          <div className="mt-1 flex gap-1">
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full rounded border border-ink-200 px-2 py-0.5 text-xs"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && saveCaption()}
            />
            <button onClick={saveCaption} className="text-purple-600">
              <Save className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingCaption(true)}
            className={`mt-1 block w-full text-center text-xs text-ink-400 hover:text-purple-600 ${captionFont}`}
          >
            {displayPhoto.caption || "Add caption..."}
            <Pencil className="ml-1 inline h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => fileRef.current?.click()}
        className="flex w-full items-center justify-center border-2 border-dashed border-ink-200 bg-ink-50/60 transition-colors hover:border-purple-300 hover:bg-purple-50/40"
        style={{ aspectRatio }}
      >
        {uploading ? (
          <CyberLoader progress={progress} />
        ) : (
          <div className="flex flex-col items-center gap-1 p-2">
            <Upload className="h-5 w-5 text-ink-300" />
            <span className="text-[10px] font-medium text-ink-400">Upload</span>
          </div>
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) { handleUpload(f); e.target.value = ""; }
        }}
      />
    </div>
  );
}

/* ─── Editable text field ─── */
function EditableText({
  value,
  onChange,
  onSave,
  placeholder,
  className = "",
  style = {},
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  placeholder: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border-b-2 border-purple-400 bg-transparent text-center outline-none ${className}`}
          style={style}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") { onSave(); setEditing(false); }
          }}
          placeholder={placeholder}
        />
        <button
          onClick={() => { onSave(); setEditing(false); }}
          className="shrink-0 text-purple-600"
        >
          <Save className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={`group inline-flex items-center gap-1 text-center ${className}`}
      style={style}
    >
      {value || <span className="italic text-ink-300">{placeholder}</span>}
      <Pencil className="h-3.5 w-3.5 text-ink-300 opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GALLERY EDITOR — The template IS the editor
   ═══════════════════════════════════════════════════════════════════════════ */

export function GalleryEditor({ gallery: initialGallery }: { gallery: GalleryData }) {
  const router = useRouter();
  const [gallery, setGallery] = useState(initialGallery);
  const [saving, setSaving] = useState(false);
  const [blogText, setBlogText] = useState(gallery.blogText || "");

  const photoMap = new Map(gallery.photos.map((p) => [p.position, p]));

  function handlePhotoAdded(position: number, newPhoto: Photo) {
    setGallery((g) => ({
      ...g,
      photos: [...g.photos.filter((p) => p.position !== position), newPhoto],
    }));
  }

  function handlePhotoRemoved(position: number, photoId: string) {
    setGallery((g) => ({
      ...g,
      photos: g.photos.filter((p) => p.id !== photoId),
    }));
  }

  async function handleSwap(posA: number, posB: number) {
    const photos = [...gallery.photos];
    const idxA = photos.findIndex(p => p.position === posA);
    const idxB = photos.findIndex(p => p.position === posB);

    if (idxA > -1) photos[idxA].position = posB;
    if (idxB > -1) photos[idxB].position = posA;

    setGallery((g) => ({ ...g, photos }));
  }

  async function saveText() {
    setSaving(true);
    try {
      await fetch("/api/admin/gallery-text", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          galleryId: gallery.id,
          titleLine1: gallery.titleLine1,
          titleLine2: gallery.titleLine2,
          subtitle: gallery.subtitle,
          blogText,
          theme: gallery.theme,
        }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const slotCount =
    gallery.theme === "bohemian" ? 7 :
    gallery.theme === "corkboard" ? 11 : 
    gallery.theme === "normal" ? 0 : 8;

  return (
    <div className="space-y-8">
      {/* ─── THEME SELECTOR ─── */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-ink-700">Gallery Theme</h3>
          <p className="text-xs text-ink-500">Change the visual style of this gallery.</p>
        </div>
        <select
          value={gallery.theme}
          onChange={(e) => setGallery(g => ({ ...g, theme: e.target.value }))}
          className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-2 text-sm font-medium text-ink-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        >
          <option value="normal">Normal (Grid - Unlimited)</option>
          <option value="bohemian">Bohemian (7 slots)</option>
          <option value="scrapbook">Scrapbook (8 slots)</option>
          <option value="corkboard">Corkboard (11 slots)</option>
        </select>
      </div>

      {/* ─── LIVE TEMPLATE EDITOR ─── */}
      {gallery.theme === "bohemian" && (
        <BohemianEditor
          gallery={gallery}
          setGallery={setGallery}
          photoMap={photoMap}
          onPhotoAdded={handlePhotoAdded}
          onPhotoRemoved={handlePhotoRemoved}
          onSwap={handleSwap}
        />
      )}
      {gallery.theme === "scrapbook" && (
        <ScrapbookEditor
          gallery={gallery}
          setGallery={setGallery}
          photoMap={photoMap}
          slotCount={slotCount}
          onPhotoAdded={handlePhotoAdded}
          onPhotoRemoved={handlePhotoRemoved}
          onSwap={handleSwap}
        />
      )}
      {gallery.theme === "corkboard" && (
        <CorkBoardEditor
          gallery={gallery}
          setGallery={setGallery}
          photoMap={photoMap}
          slotCount={slotCount}
          onPhotoAdded={handlePhotoAdded}
          onPhotoRemoved={handlePhotoRemoved}
          onSwap={handleSwap}
        />
      )}
      {gallery.theme === "normal" && (
        <NormalEditor
          gallery={gallery}
          setGallery={setGallery}
          photoMap={photoMap}
          onPhotoAdded={handlePhotoAdded}
          onPhotoRemoved={handlePhotoRemoved}
          onSwap={handleSwap}
        />
      )}

      {/* ─── Blog / Recap — Rich Text Editor ─── */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-[var(--shadow-soft)]">
        <h3 className="mb-3 text-sm font-semibold text-ink-700">
          Event Recap (optional blog)
        </h3>
        <RichTextEditor value={blogText} onChange={setBlogText} />
      </div>

      {/* ─── Save ─── */}
      <div className="flex gap-3">
        <button
          onClick={saveText}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(91,42,134,0.39)] transition-all hover:-translate-y-0.5 hover:bg-purple-700 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Gallery
        </button>
        <a
          href={`/adminahnuok/events/${gallery.eventId}`}
          className="inline-flex items-center rounded-full border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50"
        >
          Back to Event
        </a>
      </div>
    </div>
  );
}

/* ─── Theme-specific editors ─── */

type EditorProps = {
  gallery: GalleryData;
  setGallery: React.Dispatch<React.SetStateAction<GalleryData>>;
  photoMap: Map<number, Photo>;
  onPhotoAdded: (pos: number, newPhoto: Photo) => void;
  onPhotoRemoved: (pos: number, id: string) => void;
  onSwap: (posA: number, posB: number) => void;
  slotCount?: number;
};

function BohemianEditor({ gallery, setGallery, photoMap, onPhotoAdded, onPhotoRemoved, onSwap }: EditorProps) {
  return (
    <>
      {/* Mobile View: Grid Layout */}
      <div className="grid grid-cols-1 gap-6 sm:hidden bg-[#f9f7f4] p-6 rounded-2xl shadow border border-ink-100">
        <div className="text-center py-4">
          <EditableText
            value={gallery.titleLine1}
            onChange={(v) => setGallery((g) => ({ ...g, titleLine1: v }))}
            onSave={() => {}}
            placeholder="Click to add title line 1"
            className="text-xl text-ink-500"
            style={{ fontFamily: "'Caveat', cursive" }}
          />
          <div className="mt-1">
            <EditableText
              value={gallery.titleLine2}
              onChange={(v) => setGallery((g) => ({ ...g, titleLine2: v }))}
              onSave={() => {}}
              placeholder="Click to add title line 2"
              className="text-3xl font-bold text-ink-900"
            />
          </div>
          <div className="mt-2">
            <EditableText
              value={gallery.subtitle}
              onChange={(v) => setGallery((g) => ({ ...g, subtitle: v }))}
              onSave={() => {}}
              placeholder="Click to add description"
              className="text-xs text-ink-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {BOHEMIAN_SLOTS.map((slot, i) => (
            <div key={i} className="bg-white p-2 rounded-xl shadow-sm border border-ink-100">
              <div className="text-[10px] font-semibold text-ink-400 mb-1 uppercase tracking-wider">{slot.label}</div>
              <PhotoSlot
                photo={photoMap.get(i)}
                position={i}
                galleryId={gallery.id}
                aspectRatio="3/4"
                captionFont="font-sans"
                onPhotoAdded={onPhotoAdded}
                onPhotoRemoved={onPhotoRemoved}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View: Scattered Polaroids */}
      <div className="relative mx-auto w-full max-w-3xl rounded-2xl bg-[#f9f7f4] p-8 shadow-lg sm:p-12 hidden sm:block" style={{ minHeight: 600 }}>
        {/* Center text - editable */}
        <div className="relative z-10 mx-auto max-w-sm py-16 text-center sm:py-24">
          <EditableText
            value={gallery.titleLine1}
            onChange={(v) => setGallery((g) => ({ ...g, titleLine1: v }))}
            onSave={() => {}}
            placeholder="Click to add title line 1"
            className="text-2xl text-ink-500 sm:text-3xl"
            style={{ fontFamily: "'Caveat', cursive" }}
          />
          <div className="mt-2">
            <EditableText
              value={gallery.titleLine2}
              onChange={(v) => setGallery((g) => ({ ...g, titleLine2: v }))}
              onSave={() => {}}
              placeholder="Click to add title line 2"
              className="text-4xl font-bold text-ink-900 sm:text-5xl"
            />
          </div>
          <div className="mt-3">
            <EditableText
              value={gallery.subtitle}
              onChange={(v) => setGallery((g) => ({ ...g, subtitle: v }))}
              onSave={() => {}}
              placeholder="Click to add description"
              className="text-sm text-ink-500"
            />
          </div>
        </div>

        {/* Photo slots at exact positions */}
        {BOHEMIAN_SLOTS.map((slot, i) => (
          <div
            key={i}
            className="absolute shadow-[2px_3px_10px_rgba(0,0,0,0.12)] transition-all hover:z-50 focus-within:z-50 group"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", i.toString())}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const fromIdx = parseInt(e.dataTransfer.getData("text/plain"));
              if (!isNaN(fromIdx) && fromIdx !== i) onSwap(fromIdx, i);
            }}
            style={{ ...slot.style, transform: `rotate(${slot.rotate})`, zIndex: 1 }}
          >
            <div className="bg-white p-1.5 pb-6">
              <PhotoSlot
                photo={photoMap.get(i)}
                position={i}
                galleryId={gallery.id}
                aspectRatio="3/4"
                captionFont="font-sans"
                onPhotoAdded={onPhotoAdded}
                onPhotoRemoved={onPhotoRemoved}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ScrapbookEditor({ gallery, setGallery, photoMap, slotCount = 8, onPhotoAdded, onPhotoRemoved, onSwap }: EditorProps) {
  return (
    <div>
      {/* Title */}
      <div className="mb-6 text-center">
        <EditableText
          value={gallery.titleLine1}
          onChange={(v) => setGallery((g) => ({ ...g, titleLine1: v }))}
          onSave={() => {}}
          placeholder="Click to add title line 1"
          className="text-xl text-ink-400"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        />
        <div className="mt-1">
          <EditableText
            value={gallery.titleLine2}
            onChange={(v) => setGallery((g) => ({ ...g, titleLine2: v }))}
            onSave={() => {}}
            placeholder="Click to add title line 2"
            className="text-3xl font-bold text-ink-800 sm:text-4xl"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          />
        </div>
        <div className="mt-2">
          <EditableText
            value={gallery.subtitle}
            onChange={(v) => setGallery((g) => ({ ...g, subtitle: v }))}
            onSave={() => {}}
            placeholder="Click to add description"
            className="text-sm text-ink-500"
          />
        </div>
      </div>

      {/* Template with upload slots */}
      <div
        className="rounded-2xl p-6 sm:p-10"
        style={{
          background: "#e8e4de",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23d4d0c8' stroke-width='0.5'/%3E%3C/svg%3E\")",
        }}
      >
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: slotCount }).map((_, i) => (
            <div
              key={i}
              className="relative transition-all hover:z-50 focus-within:z-50 group"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", i.toString())}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const fromIdx = parseInt(e.dataTransfer.getData("text/plain"));
                if (!isNaN(fromIdx) && fromIdx !== i) onSwap(fromIdx, i);
              }}
              style={{ transform: `rotate(${SCRAPBOOK_ROTATIONS[i % SCRAPBOOK_ROTATIONS.length]})` }}
            >
              {/* Washi tape */}
              <div
                className={`absolute -top-2.5 left-1/2 z-10 h-5 w-14 -translate-x-1/2 rotate-[-2deg] ${TAPE_COLORS[i % TAPE_COLORS.length]}`}
                style={{ clipPath: "polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)" }}
              />
              <div className="bg-white p-2 pb-7 shadow-[2px_3px_12px_rgba(0,0,0,0.15)]">
                <PhotoSlot
                  photo={photoMap.get(i)}
                  position={i}
                  galleryId={gallery.id}
                  aspectRatio="1/1"
                  onPhotoAdded={onPhotoAdded}
                  onPhotoRemoved={onPhotoRemoved}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CorkBoardEditor({ gallery, setGallery, photoMap, slotCount = 11, onPhotoAdded, onPhotoRemoved, onSwap }: EditorProps) {
  return (
    <div>
      {/* Title */}
      <div className="mb-6 text-center">
        <EditableText
          value={gallery.titleLine1}
          onChange={(v) => setGallery((g) => ({ ...g, titleLine1: v }))}
          onSave={() => {}}
          placeholder="Click to add title line 1"
          className="text-xl text-ink-400"
          style={{ fontFamily: "'Cedarville Cursive', cursive" }}
        />
        <div className="mt-1">
          <EditableText
            value={gallery.titleLine2}
            onChange={(v) => setGallery((g) => ({ ...g, titleLine2: v }))}
            onSave={() => {}}
            placeholder="Click to add title line 2"
            className="text-3xl font-bold text-ink-800 sm:text-4xl"
            style={{ fontFamily: "'Cedarville Cursive', cursive" }}
          />
        </div>
      </div>

      {/* Wood board with upload slots */}
      <div
        className="min-h-[500px] rounded-2xl p-5 sm:p-8"
        style={{
          background: "#8B6914",
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px), repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255,255,255,0.02) 5px, rgba(255,255,255,0.02) 6px)",
        }}
      >
        <div className="flex flex-wrap justify-center gap-0">
          {Array.from({ length: slotCount }).map((_, i) => (
            <div
              key={i}
              className="m-2.5 w-[170px] relative transition-all hover:z-50 focus-within:z-50 group cursor-move"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", i.toString())}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const fromIdx = parseInt(e.dataTransfer.getData("text/plain"));
                if (!isNaN(fromIdx) && fromIdx !== i) onSwap(fromIdx, i);
              }}
              style={{
                transform: `rotate(${CORK_ROTATIONS[i % CORK_ROTATIONS.length]})`,
                fontFamily: "'Cedarville Cursive', cursive",
              }}
            >
              <div className="bg-white p-2.5 shadow-[1px_2px_3px_black]">
                <PhotoSlot
                  photo={photoMap.get(i)}
                  position={i}
                  galleryId={gallery.id}
                  aspectRatio="4/3"
                  onPhotoAdded={onPhotoAdded}
                  onPhotoRemoved={onPhotoRemoved}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NormalEditor({ gallery, setGallery, onPhotoAdded, onPhotoRemoved }: EditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Sort photos by position to ensure predictable order
  const photos = [...gallery.photos].sort((a, b) => a.position - b.position);

  async function handleUpload(file: File) {
    setUploading(true);
    setProgress(0);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const data: { url: string; error?: string } = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener("load", () => {
          try {
            const d = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) resolve(d);
            else reject(new Error(d.error || "Upload failed"));
          } catch { reject(new Error("Upload failed")); }
        });
        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.open("POST", "/api/admin/upload");
        xhr.send(fd);
      });

      // Calculate next position
      const nextPos = photos.length > 0 ? Math.max(...photos.map(p => p.position)) + 1 : 0;

      // Save to gallery
      const res = await fetch("/api/admin/gallery-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ galleryId: gallery.id, position: nextPos, url: data.url, caption: "" }),
      });
      if (res.ok) {
        const result = await res.json();
        const newPhoto: Photo = {
          id: result.photo?.id || `temp-${Date.now()}`,
          url: data.url,
          caption: "",
          position: nextPos,
        };
        onPhotoAdded(nextPos, newPhoto);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <div className="mx-auto my-6 w-full max-w-6xl rounded-2xl bg-[#f9f7f4] p-6 shadow-sm border border-ink-100">
      {/* Title */}
      <div className="mb-6 text-center">
        <EditableText
          value={gallery.titleLine1}
          onChange={(v) => setGallery((g) => ({ ...g, titleLine1: v }))}
          onSave={() => {}}
          placeholder="Click to add title line 1"
          className="text-xl text-ink-500 font-medium"
        />
        <div className="mt-1">
          <EditableText
            value={gallery.titleLine2}
            onChange={(v) => setGallery((g) => ({ ...g, titleLine2: v }))}
            onSave={() => {}}
            placeholder="Click to add title line 2"
            className="text-3xl font-bold text-ink-900 sm:text-4xl"
          />
        </div>
        <div className="mt-2">
          <EditableText
            value={gallery.subtitle}
            onChange={(v) => setGallery((g) => ({ ...g, subtitle: v }))}
            onSave={() => {}}
            placeholder="Click to add description"
            className="text-sm text-ink-500"
          />
        </div>
      </div>

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-200 disabled:opacity-50"
        >
          {uploading ? <CyberLoader progress={progress} /> : <><Upload className="h-4 w-4" /> Add Photo</>}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { handleUpload(f); e.target.value = ""; }
          }}
        />
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map(photo => (
          <NormalEditorPhotoCard 
            key={photo.id} 
            photo={photo} 
            onPhotoRemoved={onPhotoRemoved}
          />
        ))}
      </div>
    </div>
  );
}

function NormalEditorPhotoCard({ photo, onPhotoRemoved }: { photo: Photo, onPhotoRemoved: (pos: number, id: string) => void }) {
  const [zoom, setZoom] = useState(photo.zoom || 1);
  const [offsetX, setOffsetX] = useState(photo.offsetX || 0);
  const [offsetY, setOffsetY] = useState(photo.offsetY || 0);
  const [rotation, setRotation] = useState(photo.rotation || 0);
  const [caption, setCaption] = useState(photo.caption || "");
  const [editingCaption, setEditingCaption] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleRemove() {
    await fetch("/api/admin/gallery-photo", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId: photo.id }),
    });
    onPhotoRemoved(photo.position, photo.id);
  }

  async function saveChanges() {
    setSaving(true);
    await fetch("/api/admin/gallery-photo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId: photo.id, caption, zoom, offsetX, offsetY, rotation }),
    });
    setSaving(false);
    setShowControls(false);
    setEditingCaption(false);
  }

  return (
    <figure className="mb-4 break-inside-avoid overflow-visible rounded-xl border border-ink-200 bg-white p-2 shadow-sm relative group">
      <GalleryPhotoImg
        src={photo.url}
        alt=""
        zoom={zoom}
        offsetX={offsetX}
        offsetY={offsetY}
        rotation={rotation}
        className="rounded-lg"
      >
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all hover:bg-black/40 hover:opacity-100 z-10">
          <button
            onClick={() => setShowControls(v => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-purple-600 shadow hover:scale-105 transition-transform"
            title="Edit Photo (Zoom, Rotation, Position)"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={async () => {
              const nextRot = (rotation + 90) % 360;
              setRotation(nextRot);
              setSaving(true);
              await fetch("/api/admin/gallery-photo", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ photoId: photo.id, caption, zoom, offsetX, offsetY, rotation: nextRot }),
              });
              setSaving(false);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-blue-600 shadow hover:scale-105 transition-transform"
            title="Rotate 90°"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleRemove}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 shadow hover:scale-105 transition-transform"
            title="Remove Photo"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </GalleryPhotoImg>
      
      {showControls && (
        <div className="mt-2 w-full rounded-xl bg-ink-900 p-3 text-white shadow-md">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ZoomOut className="h-4 w-4 text-ink-300" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={e => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-purple-400"
              />
              <ZoomIn className="h-4 w-4 text-ink-300" />
              <span className="w-9 text-right text-xs font-medium text-ink-200">{zoom.toFixed(1)}x</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCw className="h-4 w-4 text-ink-300" />
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotation > 180 ? rotation - 360 : (rotation < -180 ? rotation + 360 : rotation)}
                onChange={e => setRotation(parseFloat(e.target.value))}
                className="flex-1 accent-blue-400"
              />
              <span className="w-9 text-right text-xs font-medium text-ink-200">{Math.round(rotation)}°</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="mr-1 text-xs text-ink-300">Pos:</span>
                <button onClick={() => setOffsetX(x => x - 5)} className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20">←</button>
                <button onClick={() => setOffsetX(x => x + 5)} className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20">→</button>
                <button onClick={() => setOffsetY(y => y - 5)} className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20">↑</button>
                <button onClick={() => setOffsetY(y => y + 5)} className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20">↓</button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setZoom(1);
                    setOffsetX(0);
                    setOffsetY(0);
                    setRotation(0);
                  }}
                  className="text-xs text-ink-400 hover:text-white"
                >
                  Reset
                </button>
                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className="rounded-lg bg-purple-600 px-3 py-1 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50"
                >
                  {saving ? "..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingCaption ? (
        <div className="mt-2 flex gap-1 px-1">
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full rounded border border-ink-200 px-2 py-1 text-sm"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && saveChanges()}
          />
          <button onClick={saveChanges} disabled={saving} className="text-purple-600 p-1">
            <Save className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditingCaption(true)}
          className="mt-2 block w-full text-center text-sm text-ink-500 hover:text-purple-600 px-1"
        >
          {photo.caption || "Add caption..."}
          <Pencil className="ml-1.5 inline h-3.5 w-3.5" />
        </button>
      )}
    </figure>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RICH TEXT EDITOR — Simple WYSIWYG for event recap
   ═══════════════════════════════════════════════════════════════════════════ */

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];

function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showFontSize, setShowFontSize] = useState(false);

  function exec(command: string, val?: string) {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  const toolbarBtn = "flex h-8 w-8 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-purple-50 hover:text-purple-700";

  return (
    <div className="rounded-xl border border-ink-200 bg-white focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100">
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-0.5 border-b border-ink-100 px-2 py-1.5"
        onMouseDown={(e) => e.preventDefault()}
      >
        <button type="button" onClick={() => exec("bold")} className={toolbarBtn} title="Bold">
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => exec("italic")} className={toolbarBtn} title="Italic">
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => exec("underline")} className={toolbarBtn} title="Underline">
          <Underline className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-ink-200" />

        <button type="button" onClick={() => exec("formatBlock", "h1")} className={toolbarBtn} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => exec("formatBlock", "h2")} className={toolbarBtn} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => exec("formatBlock", "p")} className={toolbarBtn} title="Paragraph">
          <Type className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-ink-200" />

        {/* Font Size */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setShowFontSize((v) => !v); }}
            className={`${toolbarBtn} text-xs font-bold`}
            title="Font size"
          >
            A↕
          </button>
          {showFontSize && (
            <div className="absolute left-0 top-full z-30 mt-1 flex flex-col rounded-lg border border-ink-200 bg-white p-1 shadow-lg">
              {FONT_SIZES.map((s, idx) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { exec("fontSize", String(idx + 1)); setShowFontSize(false); }}
                  className="rounded px-3 py-1 text-left text-xs text-ink-600 hover:bg-purple-50"
                  style={{ fontSize: s }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Picker */}
        <div className="relative flex items-center">
          <label className={`${toolbarBtn} cursor-pointer relative overflow-hidden`} title="Text color">
            <Palette className="h-4 w-4" />
            <input
              type="color"
              onChange={(e) => exec("foreColor", e.target.value)}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        className="min-h-[180px] px-4 py-3 text-base leading-relaxed text-ink-800 outline-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2 [&_p]:mb-2"
        data-placeholder="Write about how the event went, memorable moments, highlights..."
      />
    </div>
  );
}
