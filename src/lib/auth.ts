import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "advaya_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me"
);
const MAX_AGE = 60 * 60 * 8; // 8 hours

export type SessionPayload = {
  sub: string; // admin id
  name: string;
  email: string;
  role: string;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(
  payload: SessionPayload,
  ipAddress: string = "Unknown",
  location: string = "Unknown",
  userAgent: string = "Unknown"
): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret);

  // Save session in DB
  const { db } = await import("./db");
  await db.adminSession.create({
    data: {
      adminId: payload.sub,
      token,
      ipAddress,
      location,
      userAgent,
      lastActiveAt: new Date(),
    }
  });

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  
  try {
    const { payload } = await jwtVerify(token, secret);
    
    // Check if session still exists in DB
    const { db } = await import("./db");
    const sessionRecord = await db.adminSession.findUnique({
      where: { token },
      select: { id: true },
    });
    
    if (!sessionRecord) {
      store.delete(COOKIE_NAME);
      return null;
    }
    
    return payload as unknown as SessionPayload;
  } catch {
    store.delete(COOKIE_NAME);
    return null;
  }
}

/** Verify a token string (used in middleware where cookies() isn't available the same way). */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    
    // We can't import Prisma directly into edge middleware, 
    // but verifyToken is only used if there's middleware.
    // If it's used in edge middleware, doing db calls will fail.
    // Let's assume we are safe to do standard fetch or DB call if not on Edge.
    // However, if verifyToken is truly in middleware, we skip the DB check here to avoid Edge crash.
    // Wait, let's just do a dynamic import for DB check. If it crashes, it's Edge.
    // Actually, in Advaya, we don't have Edge middleware.
    
    const { db } = await import("./db");
    const sessionRecord = await db.adminSession.findUnique({
      where: { token },
      select: { id: true },
    });
    
    if (!sessionRecord) {
      return null;
    }
    
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = COOKIE_NAME;
