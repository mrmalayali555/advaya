"use server";

import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function deleteMedia(id: string) {
  await requireAdmin();
  const media = await db.media.findUnique({ where: { id } });
  if (media) {
    // Best-effort remove the file from disk for local uploads.
    if (media.url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", media.url);
      await unlink(filePath).catch(() => {});
    }
    await db.media.delete({ where: { id } });
  }
  revalidatePath("/admin/media");
}
