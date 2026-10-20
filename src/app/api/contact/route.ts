import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { sendMail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const { ok, retryAfter } = rateLimit(`contact:${ip}`, { max: 3, windowMs: 60_000 });
  if (!ok) {
    return NextResponse.json(
      { error: `Too many messages. Try again in ${retryAfter}s.` },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed." },
      { status: 422 }
    );
  }

  const { name, email, message } = parsed.data;

  const sent = await sendMail({
    subject: `New contact message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  return NextResponse.json({ ok: true, delivered: sent }, { status: 200 });
}
