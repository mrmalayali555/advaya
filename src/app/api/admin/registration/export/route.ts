import { requireAdmin } from "@/lib/require-admin";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const formId = searchParams.get("formId");

    if (!formId) {
      return new NextResponse("Missing formId", { status: 400 });
    }

    const form = await db.registrationForm.findUnique({
      where: { id: formId },
      include: {
        fields: { orderBy: { order: "asc" } },
        submissions: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!form) {
      return new NextResponse("Form not found", { status: 404 });
    }

    // Prepare CSV header
    const headers = ["Submission ID", "Date", ...form.fields.map((f) => f.label), "Files"];
    
    // Prepare rows
    const rows = form.submissions.map((sub) => {
      let data: any = {};
      try {
        data = JSON.parse(sub.data);
      } catch (e) {}

      let filesStr = "";
      try {
        const filesObj = sub.files ? JSON.parse(sub.files) : {};
        filesStr = Object.values(filesObj).join("; ");
      } catch (e) {}

      const row = [
        sub.id,
        sub.createdAt.toISOString(),
        ...form.fields.map((f) => {
          const val = data[f.id];
          if (Array.isArray(val)) return val.join(", ");
          return val || "";
        }),
        filesStr,
      ];

      return row.map(cell => {
        const cellStr = String(cell).replace(/"/g, '""');
        return `"${cellStr}"`;
      }).join(",");
    });

    const csv = [headers.map(h => `"${h}"`).join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="submissions-${form.slug}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
