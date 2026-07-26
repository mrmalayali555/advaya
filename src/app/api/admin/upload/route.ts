import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { put } from "@vercel/blob";

const MAX = {
  image: 8 * 1024 * 1024, // 8 MB
  video: 100 * 1024 * 1024, // 100 MB
  pdf: 20 * 1024 * 1024, // 20 MB
};
const ALLOWED: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  pdf: ["application/pdf"],
};

function kindOf(mime: string): "image" | "video" | "pdf" | null {
  if (ALLOWED.image.includes(mime)) return "image";
  if (ALLOWED.video.includes(mime)) return "video";
  if (ALLOWED.pdf.includes(mime)) return "pdf";
  return null;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const kind = kindOf(file.type);
  if (!kind) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 415 });
  }
  if (file.size > MAX[kind]) {
    return NextResponse.json(
      { error: `File too large (max ${MAX[kind] / 1024 / 1024}MB).` },
      { status: 413 }
    );
  }

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;

  try {
    // Upload to Vercel Blob
    const blob = await put(filename, file, { access: 'public' });
    const url = blob.url;

    const media = await db.media.create({
      data: {
        name: file.name,
        url,
        type: kind,
        mime: file.type,
        size: file.size,
      },
    });

    return NextResponse.json({ ok: true, url, id: media.id, type: kind }, { status: 201 });
    } catch (error: any) {
    console.error("Upload error:", error);
    if (error.message && error.message.includes("Vercel Blob storage is not configured")) {
      return NextResponse.json({ 
        error: "Vercel Blob is not configured. Please add BLOB_READ_WRITE_TOKEN to your Vercel Environment Variables." 
      }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || "Failed to upload file to storage." }, { status: 500 });
  }
}
