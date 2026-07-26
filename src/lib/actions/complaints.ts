"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function setComplaintStatus(id: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status") || "new");
  await db.complaint.update({ where: { id }, data: { status } });
  revalidatePath("/adminahnuok/complaints");
  revalidatePath(`/adminahnuok/complaints/${id}`);
}

export async function deleteComplaint(id: string) {
  await requireAdmin();
  await db.complaint.delete({ where: { id } });
  revalidatePath("/adminahnuok/complaints");
  redirect("/adminahnuok/complaints");
}

