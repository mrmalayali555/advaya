import "server-only";
import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "./auth";

/** Use in admin server components / actions. Redirects to login if not authed. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/adminahnuok/login");
  return session;
}
