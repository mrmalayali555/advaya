import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { complaintSchema } from "@/lib/validations";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { sendMail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const { ok, retryAfter } = rateLimit(`complaint:${ip}`, { max: 3, windowMs: 60_000 });
  if (!ok) {
    return NextResponse.json(
      { error: `Too many submissions. Try again in ${retryAfter}s.` },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = complaintSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed." },
      { status: 422 }
    );
  }

  const { anonymous, name, email, message } = parsed.data;

  const complaint = await db.complaint.create({
    data: {
      anonymous,
      name: anonymous ? null : name || null,
      email: anonymous ? null : email || null,
      message,
    },
  });

  // Notify admin (best-effort; never blocks the response on failure).
  sendMail({
    subject: `New complaint received — ADVAYA`,
    text: [
      `A new ${anonymous ? "anonymous" : "named"} complaint was submitted.`,
      !anonymous && name ? `Name: ${name}` : null,
      !anonymous && email ? `Email: ${email}` : null,
      ``,
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  }).catch(() => {});

  return NextResponse.json({ ok: true, id: complaint.id }, { status: 201 });
}
