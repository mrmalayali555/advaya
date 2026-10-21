import PDFDocument from "pdfkit";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getFinanceConfig } from "@/lib/finance";

export const runtime = "nodejs";

function parseDate(value: string | null) {
  if (!value) return null;
  const date = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(request: NextRequest) {
  const config = await getFinanceConfig();
  if (!config.allowPdfExport) {
    return new Response("PDF export is currently disabled.", { status: 404 });
  }

  const params = request.nextUrl.searchParams;
  const kind = params.get("kind");
  const category = params.get("category");
  const from = parseDate(params.get("from"));
  const to = parseDate(params.get("to"));
  const entries = await db.financeEntry.findMany({
    where: {
      ...(kind === "income" || kind === "expenditure" ? { kind } : {}),
      ...(category && category !== "all" ? { category } : {}),
      ...(from || to
        ? {
            OR: [
              { date: { lte: to || new Date("9999-12-31") }, endDate: { gte: from || new Date("1970-01-01") } },
              { date: { gte: from || new Date("1970-01-01"), lte: to || new Date("9999-12-31") } },
            ],
          }
        : {}),
    },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  const document = new PDFDocument({ margin: 48, size: "A4" });
  const chunks: Buffer[] = [];
  document.on("data", (chunk: Buffer) => chunks.push(chunk));
  const finished = new Promise<Buffer>((resolve) => document.on("end", () => resolve(Buffer.concat(chunks))));

  document.fontSize(20).fillColor("#35105d").text(config.title);
  document.moveDown(0.35).fontSize(10).fillColor("#555555").text("Filtered financial transparency report");
  document.moveDown(1);

  const income = entries.filter((entry) => entry.kind === "income").reduce((sum, entry) => sum + entry.amount, 0);
  const expenditure = entries.filter((entry) => entry.kind === "expenditure").reduce((sum, entry) => sum + entry.amount, 0);
  document.fontSize(11).fillColor("#111111").text(`Entries: ${entries.length}`);
  document.text(`Income: ${money(income)}    Expenditure: ${money(expenditure)}    Balance: ${money(income - expenditure)}`);
  document.moveDown(1);

  entries.forEach((entry, index) => {
    if (document.y > 740) document.addPage();
    document.fontSize(10).fillColor(entry.kind === "income" ? "#087443" : "#a42a3b")
      .text(`${index + 1}. ${entry.kind === "income" ? "+" : "-"}${money(entry.amount)}  ${entry.label}`);
    document.fontSize(8.5).fillColor("#555555")
      .text(`${entry.category}  |  ${formatPeriod(entry.date, entry.endDate)}${entry.note ? `  |  ${entry.note}` : ""}`, { indent: 14 });
    document.moveDown(0.45);
  });

  document.end();
  const pdf = await finished;
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="advaya-${config.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-report.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

function money(value: number) {
  return `Rs. ${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatPeriod(start: Date, end: Date | null) {
  const from = start.toLocaleDateString("en-IN", { dateStyle: "medium" });
  return end ? `${from} - ${end.toLocaleDateString("en-IN", { dateStyle: "medium" })}` : from;
}
