"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  // Basic brute-force guard keyed by email.
  const { ok } = rateLimit(`login:${email.toLowerCase()}`, { max: 8, windowMs: 5 * 60_000 });
  if (!ok) return { error: "Too many attempts. Please wait a few minutes." };

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const admin = await db.admin.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  // Constant-ish response to avoid user enumeration.
  if (!admin || !(await verifyPassword(parsed.data.password, admin.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    sub: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });

  redirect("/adminahnuok");
}

export async function logoutAction() {
  await destroySession();
  redirect("/adminahnuok/login");
}
