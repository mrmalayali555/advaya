import "server-only";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession, type SessionPayload } from "./auth";

/** Use in admin server components / actions. Redirects to login if not authed. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    const store = await cookies();
    if (store.has("advaya_session")) {
      redirect("/adminahnuok/login?clear_session=1");
    }
    redirect("/adminahnuok/login");
  }
  return session;
}
