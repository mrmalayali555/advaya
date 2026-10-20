import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { getAuthSecret } from "@/lib/auth-secret";

const COOKIE = "advaya_session";

async function isValid(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getAuthSecret());
    const session = await db.adminSession.findUnique({
      where: { token },
      select: { id: true },
    });
    if (!session) return false;
    return true;
  } catch {
    return false;
  }
}

/** Paths commonly probed by bots — return 404 immediately. */
const BLOCKED = [
  "/wp-admin", "/wp-login", "/phpmyadmin", "/.env",
  "/xmlrpc.php", "/admin.php", "/wp-content", "/wp-includes",
  "/.git", "/cgi-bin", "/config.php", "/.aws", "/vendor",
  "/backup.sql", "/db.sql", "/dump.sql",
];

function addSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  res.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  res.headers.set("X-DNS-Prefetch-Control", "off");
  return res;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Block common bot probes.
  if (BLOCKED.some((b) => pathname.toLowerCase().startsWith(b))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const token = req.cookies.get(COOKIE)?.value;
  const authed = await isValid(token);

  // Protect all /api/admin/* endpoints at the edge/proxy layer.
  if (pathname.startsWith("/api/admin")) {
    if (!authed) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Unauthorized — valid admin session required." }, { status: 401 })
      );
    }
    return addSecurityHeaders(NextResponse.next());
  }

  // Login page: if already authed, bounce to dashboard.
  if (pathname === "/adminahnuok/login") {
    // If the server tells us to clear the session, do it here and prevent infinite redirect
    if (req.nextUrl.searchParams.get("clear_session") === "1") {
      const res = NextResponse.redirect(new URL("/adminahnuok/login", req.url));
      res.cookies.delete(COOKIE);
      return addSecurityHeaders(res);
    }
    
    if (authed) return NextResponse.redirect(new URL("/adminahnuok", req.url));
    return addSecurityHeaders(NextResponse.next());
  }

  // Everything else under /adminahnuok requires a valid session.
  if (pathname.startsWith("/adminahnuok")) {
    if (!authed) {
      const url = new URL("/adminahnuok/login", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    return addSecurityHeaders(NextResponse.next());
  }

  // TEMPORARY MAINTENANCE MODE
  // This proxy runs on Node.js in Next 16, so the existing Prisma settings
  // store can be read for every request without a deployment-time toggle.
  let maintenanceEnabled = false;
  try {
    const setting = await db.setting.findUnique({ where: { key: "maintenance_mode" } });
    maintenanceEnabled = setting?.value ? JSON.parse(setting.value).enabled === true : false;
  } catch (error) {
    console.error("Unable to read maintenance mode setting:", error);
    if (pathname.startsWith("/api/")) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Public services are temporarily unavailable." },
          { status: 503, headers: { "Retry-After": "60", "Cache-Control": "no-store" } }
        )
      );
    }
    return addSecurityHeaders(
      new NextResponse("Public website temporarily unavailable.", {
        status: 503,
        headers: { "Retry-After": "60", "Cache-Control": "no-store" },
      })
    );
  }

  if (maintenanceEnabled && pathname.startsWith("/api/")) {
    return addSecurityHeaders(
      NextResponse.json(
        { error: "The public website is temporarily under maintenance." },
        { status: 503, headers: { "Retry-After": "3600", "Cache-Control": "no-store" } }
      )
    );
  }

  if (maintenanceEnabled && pathname !== "/maintenance") {
    const response = NextResponse.rewrite(new URL("/maintenance", req.url), {
      status: 503,
    });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Retry-After", "3600");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return addSecurityHeaders(response);
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    // TEMPORARY MAINTENANCE MODE: exclude Next internals and file assets so
    // the maintenance page can load its fonts, logo, and generated bundles.
    "/((?!_next/static|_next/image|favicon.ico|maintenance(?:/.*)?|.*\\..*).*)",
  ],
};
