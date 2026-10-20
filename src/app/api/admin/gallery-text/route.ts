import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { galleryId, titleLine1, titleLine2, subtitle, blogText, theme, mobileColumns } = body;

  if (!galleryId) {
    return NextResponse.json({ error: "Missing galleryId" }, { status: 400 });
  }

  const updateData: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    blogText: string | null;
    theme?: string;
  } = {
    titleLine1: titleLine1 || "",
    titleLine2: titleLine2 || "",
    subtitle: subtitle || "",
    blogText: blogText || null,
  };
  
  if (theme) {
    updateData.theme = theme;
  }

  const gallery = await db.eventGallery.findUnique({
    where: { id: galleryId },
    include: { event: { select: { slug: true } } },
  });
  if (!gallery) return NextResponse.json({ error: "Gallery not found" }, { status: 404 });

  await db.eventGallery.update({
    where: { id: galleryId },
    data: updateData,
  });

  const columns = Number(mobileColumns);
  if (Number.isInteger(columns) && columns >= 1 && columns <= 3) {
    await db.setting.upsert({
      where: { key: `event_gallery_layout:${galleryId}` },
      update: { value: JSON.stringify({ mobileColumns: columns }) },
      create: { key: `event_gallery_layout:${galleryId}`, value: JSON.stringify({ mobileColumns: columns }) },
    });
  }

  revalidatePath("/adminahnuok");
  revalidatePath("/events");
  revalidatePath(`/events/${gallery.event.slug}`);

  return NextResponse.json({ ok: true });
}
