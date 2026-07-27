import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { galleryId, posA, posB } = body;

  if (!galleryId || posA === undefined || posB === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Find both photos
  const photoA = await db.galleryPhoto.findFirst({ where: { galleryId, position: posA } });
  const photoB = await db.galleryPhoto.findFirst({ where: { galleryId, position: posB } });

  // Use a transaction to swap safely
  const operations = [];

  // Temporarily move to negative positions to avoid unique constraint issues if any,
  // though position is not marked unique in schema. Still safe.
  if (photoA) {
    operations.push(db.galleryPhoto.update({ where: { id: photoA.id }, data: { position: -1 } }));
  }
  if (photoB) {
    operations.push(db.galleryPhoto.update({ where: { id: photoB.id }, data: { position: -2 } }));
  }
  
  if (photoA) {
    operations.push(db.galleryPhoto.update({ where: { id: photoA.id }, data: { position: posB } }));
  }
  if (photoB) {
    operations.push(db.galleryPhoto.update({ where: { id: photoB.id }, data: { position: posA } }));
  }

  if (operations.length > 0) {
    await db.$transaction(operations);
  }

  revalidatePath("/adminahnuok");
  revalidatePath("/events");

  return NextResponse.json({ ok: true });
}
