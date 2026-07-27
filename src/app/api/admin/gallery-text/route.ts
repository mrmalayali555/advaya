import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { galleryId, titleLine1, titleLine2, subtitle, blogText, theme } = body;

  if (!galleryId) {
    return NextResponse.json({ error: "Missing galleryId" }, { status: 400 });
  }

  const updateData: any = {
    titleLine1: titleLine1 || "",
    titleLine2: titleLine2 || "",
    subtitle: subtitle || "",
    blogText: blogText || null,
  };
  
  if (theme) {
    updateData.theme = theme;
  }

  await db.eventGallery.update({
    where: { id: galleryId },
    data: updateData,
  });

  revalidatePath("/adminahnuok");
  revalidatePath("/events");

  return NextResponse.json({ ok: true });
}
