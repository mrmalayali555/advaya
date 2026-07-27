"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGallery(eventId: string, theme: string) {
  await requireAdmin();

  await db.eventGallery.create({
    data: {
      eventId,
      theme,
      titleLine1: "Event Gallery",
      subtitle: "Memories from the event",
    },
  });

  revalidatePath(`/adminahnuok/events/${eventId}`);
  revalidatePath("/events");
  
  redirect(`/adminahnuok/events/${eventId}/gallery/customize`);
}

export async function updateGalleryText(galleryId: string, formData: FormData) {
  await requireAdmin();

  const titleLine1 = formData.get("titleLine1") as string;
  const titleLine2 = formData.get("titleLine2") as string;
  const subtitle = formData.get("subtitle") as string;
  const blogText = formData.get("blogText") as string;

  const gallery = await db.eventGallery.update({
    where: { id: galleryId },
    data: {
      titleLine1: titleLine1 || "",
      titleLine2: titleLine2 || "",
      subtitle: subtitle || "",
      blogText: blogText || null,
    },
  });

  revalidatePath(`/adminahnuok/events/${gallery.eventId}`);
  revalidatePath(`/adminahnuok/events/${gallery.eventId}/gallery/customize`);
  revalidatePath("/events");
}

export async function addGalleryPhoto(galleryId: string, formData: FormData) {
  await requireAdmin();

  const url = formData.get("url") as string;
  const caption = formData.get("caption") as string;
  const position = parseInt(formData.get("position") as string) || 0;

  if (!url) {
    throw new Error("URL is required");
  }

  const photo = await db.galleryPhoto.create({
    data: {
      galleryId,
      url,
      caption: caption || "",
      position,
    },
    include: {
      gallery: true
    }
  });

  revalidatePath(`/adminahnuok/events/${photo.gallery.eventId}/gallery/customize`);
  revalidatePath("/events");
}

export async function removeGalleryPhoto(photoId: string) {
  await requireAdmin();

  const photo = await db.galleryPhoto.delete({
    where: { id: photoId },
    include: { gallery: true }
  });

  revalidatePath(`/adminahnuok/events/${photo.gallery.eventId}/gallery/customize`);
  revalidatePath("/events");
}

export async function updateGalleryPhoto(photoId: string, formData: FormData) {
  await requireAdmin();

  const caption = formData.get("caption") as string;

  const photo = await db.galleryPhoto.update({
    where: { id: photoId },
    data: {
      caption: caption || "",
    },
    include: { gallery: true }
  });

  revalidatePath(`/adminahnuok/events/${photo.gallery.eventId}/gallery/customize`);
  revalidatePath("/events");
}

export async function deleteGallery(galleryId: string) {
  await requireAdmin();

  const gallery = await db.eventGallery.delete({
    where: { id: galleryId },
  });

  revalidatePath(`/adminahnuok/events/${gallery.eventId}`);
  revalidatePath("/events");

  redirect(`/adminahnuok/events/${gallery.eventId}`);
}
