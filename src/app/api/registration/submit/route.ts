import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formId, data, files } = body;

    if (!formId || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const form = await db.registrationForm.findUnique({
      where: { id: formId },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (!form.published) {
      return NextResponse.json({ error: "Form is not published" }, { status: 403 });
    }

    if (form.deadline && new Date() > new Date(form.deadline)) {
      return NextResponse.json({ error: "Registration deadline has passed" }, { status: 403 });
    }

    const submission = await db.registrationSubmission.create({
      data: {
        formId,
        data: JSON.stringify(data),
        files: files ? JSON.stringify(files) : null,
      },
    });

    return NextResponse.json({ success: true, submissionId: submission.id });
  } catch (error: any) {
    console.error("Registration submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
