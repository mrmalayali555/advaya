import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

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

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  const url = `/uploads/${filename}`;

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
}
