"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function saveMarquee(formData: FormData) {
  await requireAdmin();
  const data = {
    enabled: formData.get("enabled") ? true : false,
    text: String(formData.get("text") || "").trim(),
    buttonText: String(formData.get("buttonText") || "").trim() || null,
    buttonUrl: String(formData.get("buttonUrl") || "").trim() || null,
  };

  const existing = await db.marquee.findFirst({ orderBy: { updatedAt: "desc" } });
  if (existing) {
    await db.marquee.update({ where: { id: existing.id }, data });
  } else {
    await db.marquee.create({ data });
  }

  const speed = String(formData.get("speed") || "8");
  await db.setting.upsert({
    where: { key: "marquee_speed" },
    update: { value: speed },
    create: { key: "marquee_speed", value: speed },
  });

  revalidatePath("/");
  revalidatePath("/adminahnuok/marquee");
}

