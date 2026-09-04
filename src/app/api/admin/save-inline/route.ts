import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me"
);
const COOKIE = "advaya_session";

async function isAdmin(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type, key, field, value } = await req.json();

    if (!key || !field) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type === "setting") {
      const row = await db.setting.findUnique({ where: { key } });
      let currentVal: Record<string, any> = {};
      try {
        if (row?.value) {
          currentVal = JSON.parse(row.value);
        }
      } catch {}

      currentVal[field] = value;

      await db.setting.upsert({
        where: { key },
        update: { value: JSON.stringify(currentVal) },
        create: { key, value: JSON.stringify(currentVal) },
      });
    } else if (type === "page") {
      const row = await db.page.findUnique({ where: { key } });
      let currentVal: Record<string, any> = {};
      try {
        if (row?.content) {
          currentVal = JSON.parse(row.content);
        }
      } catch {}

      currentVal[field] = value;

      await db.page.upsert({
        where: { key },
        update: { content: JSON.stringify(currentVal) },
        create: { key, title: key.toUpperCase(), content: JSON.stringify(currentVal) },
      });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/emergency");
    revalidatePath("/adminahnuok/pages");
    revalidatePath("/adminahnuok/settings");

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error saving content" }, { status: 500 });
  }
}
