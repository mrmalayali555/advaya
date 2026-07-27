import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { galleryId, position, url, caption, zoom, offsetX, offsetY } = body;

  if (!galleryId || position === undefined || !url) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Delete existing photo at this position if any
  await db.galleryPhoto.deleteMany({
    where: { galleryId, position },
  });

  const photo = await db.galleryPhoto.create({
    data: { 
      galleryId, 
      position, 
      url, 
      caption: caption || "",
      zoom: zoom !== undefined ? zoom : 1,
      offsetX: offsetX !== undefined ? offsetX : 0,
      offsetY: offsetY !== undefined ? offsetY : 0,
    },
  });

  revalidatePath("/adminahnuok");
  revalidatePath("/events");

  return NextResponse.json({ ok: true, photo }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { photoId } = body;

  if (!photoId) {
    return NextResponse.json({ error: "Missing photoId" }, { status: 400 });
  }

  await db.galleryPhoto.delete({ where: { id: photoId } });

  revalidatePath("/adminahnuok");
  revalidatePath("/events");

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { photoId, caption, zoom, offsetX, offsetY } = body;

  if (!photoId) {
    return NextResponse.json({ error: "Missing photoId" }, { status: 400 });
  }

  const updateData: any = {};
  if (caption !== undefined) updateData.caption = caption;
  if (zoom !== undefined) updateData.zoom = zoom;
  if (offsetX !== undefined) updateData.offsetX = offsetX;
  if (offsetY !== undefined) updateData.offsetY = offsetY;

  await db.galleryPhoto.update({
    where: { id: photoId },
    data: updateData,
  });

  revalidatePath("/adminahnuok");
  revalidatePath("/events");

  return NextResponse.json({ ok: true });
}
