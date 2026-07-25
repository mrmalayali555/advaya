import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me"
);
const COOKIE = "advaya_session";

async function isValid(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE)?.value;
  const authed = await isValid(token);

  // Login page: if already authed, bounce to dashboard.
  if (pathname === "/adminahnuok/login") {
    if (authed) return NextResponse.redirect(new URL("/adminahnuok", req.url));
    return NextResponse.next();
  }

  // Everything else under /adminahnuok requires a valid session.
  if (!authed) {
    const url = new URL("/adminahnuok/login", req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Security headers for the admin area.
  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}

export const config = {
  matcher: ["/adminahnuok/:path*"],
};
