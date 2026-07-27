"use server";

import { requireAdmin } from "@/lib/require-admin";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function changeAdminPassword(formData: FormData) {
  const session = await requireAdmin();

  const masterPassword = formData.get("master_password") as string;
  const newPassword = formData.get("new_password") as string;
  const logoutOthers = formData.get("logout_others") === "on";

  if (!masterPassword || !newPassword) {
    return { error: "Both master password and new password are required." };
  }

  // Verify the master password exactly as requested by the user
  if (masterPassword !== "Shyba247") {
    return { error: "Incorrect master password." };
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters long." };
  }

  const hashedPassword = await hashPassword(newPassword);

  await db.admin.update({
    where: { id: session.sub },
    data: { passwordHash: hashedPassword },
  });

  if (logoutOthers) {
    // Get the current token from cookies to exclude it
    const { cookies } = await import("next/headers");
    const store = await cookies();
    const currentToken = store.get("advaya_session")?.value;

    if (currentToken) {
      await db.adminSession.deleteMany({
        where: {
          adminId: session.sub,
          token: { not: currentToken },
        },
      });
    } else {
      // Fallback: delete all if we somehow don't have the token
      await db.adminSession.deleteMany({
        where: { adminId: session.sub },
      });
    }
  }

  revalidatePath("/adminahnuok/settings");
  return { success: true };
}
