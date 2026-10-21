import PDFDocument from "pdfkit";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getFinanceConfig } from "@/lib/finance";
import { SITE } from "@/lib/site";

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

  const document = new PDFDocument({ margin: 42, size: "A4", bufferPages: true });
  const chunks: Buffer[] = [];
  document.on("data", (chunk: Buffer) => chunks.push(chunk));
  const finished = new Promise<Buffer>((resolve) => document.on("end", () => resolve(Buffer.concat(chunks))));

  const income = entries.filter((entry) => entry.kind === "income").reduce((sum, entry) => sum + entry.amount, 0);
  const expenditure = entries.filter((entry) => entry.kind === "expenditure").reduce((sum, entry) => sum + entry.amount, 0);
  const balance = income - expenditure;
  const generatedAt = new Date();
  const filters = [
    kind === "income" ? config.incomeLabel : kind === "expenditure" ? config.expenditureLabel : "All entries",
    category && category !== "all" ? category : "All categories",
    from || to ? `${from ? formatDate(from) : "Any date"} - ${to ? formatDate(to) : "Any date"}` : "All dates",
  ];
  const pageWidth = document.page.width;
  const contentWidth = pageWidth - document.page.margins.left - document.page.margins.right;
  const navy = "#160b24";
  const purple = "#6d28d9";
  const muted = "#6b6373";
  const light = "#f6f3fa";
  const green = "#087443";
  const red = "#b4233c";

  drawHeader(document, config.title, generatedAt, navy, purple);
  document.moveDown(1.1);
  document.fontSize(25).fillColor(navy).font("Helvetica-Bold").text("Financial transparency report");
  document.moveDown(0.25);
  document.fontSize(10).fillColor(muted).font("Helvetica").text("A verified snapshot of recorded union income and expenditure.");
  document.moveDown(0.9);
  document.roundedRect(document.x, document.y, contentWidth, 35, 8).fill("#f0e9fb");
  document.fillColor("#4c1d95").fontSize(9).font("Helvetica-Bold").text("REPORT SCOPE", document.x + 12, document.y + 11);
  document.fillColor("#5b5264").font("Helvetica").text(filters.join("  •  "), document.x + 90, document.y + 11, { width: contentWidth - 102 });
  document.y += 50;

  const cardGap = 10;
  const cardWidth = (contentWidth - cardGap * 2) / 3;
  drawMetric(document, document.x, document.y, cardWidth, "TOTAL INCOME", money(income), "#e9f8f1", green);
  drawMetric(document, document.x + cardWidth + cardGap, document.y, cardWidth, "TOTAL EXPENDITURE", money(expenditure), "#fff0f2", red);
  drawMetric(document, document.x + (cardWidth + cardGap) * 2, document.y, cardWidth, "CURRENT BALANCE", money(balance), "#f0e9fb", purple);
  document.y += 78;

  document.fontSize(13).fillColor(navy).font("Helvetica-Bold").text("Transaction register");
  document.moveDown(0.45);
  drawTableHeader(document, contentWidth, light, muted);

  entries.forEach((entry, index) => {
    if (document.y > document.page.height - 78) {
      document.addPage();
      drawHeader(document, config.title, generatedAt, navy, purple);
      document.y = 92;
      drawTableHeader(document, contentWidth, light, muted);
    }
    const rowY = document.y;
    const rowHeight = entry.note ? 42 : 31;
    if (index % 2 === 0) document.rect(document.x, rowY - 5, contentWidth, rowHeight).fill("#fbfaff");
    const amountColor = entry.kind === "income" ? green : red;
    document.font("Helvetica-Bold").fontSize(9).fillColor(navy).text(entry.label, document.x + 8, rowY + 2, { width: 190, ellipsis: true });
    document.font("Helvetica").fontSize(8).fillColor(muted).text(entry.category, document.x + 8, rowY + 16, { width: 190, ellipsis: true });
    document.fillColor("#3c3442").text(formatPeriod(entry.date, entry.endDate), document.x + 205, rowY + 7, { width: 115, ellipsis: true });
    document.fillColor(amountColor).font("Helvetica-Bold").text(`${entry.kind === "income" ? "+" : "-"}${money(entry.amount)}`, document.x + contentWidth - 105, rowY + 7, { width: 97, align: "right" });
    if (entry.note) document.fillColor(muted).font("Helvetica-Oblique").fontSize(7.5).text(entry.note, document.x + 8, rowY + 29, { width: contentWidth - 16, ellipsis: true });
    document.y = rowY + rowHeight;
  });

  if (entries.length === 0) {
    document.moveDown(1.5).font("Helvetica").fontSize(10).fillColor(muted).text("No transactions match the selected filters.", { align: "center" });
  }

  drawFooters(document, SITE.url, generatedAt, purple, muted);

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

function drawHeader(document: PDFKit.PDFDocument, title: string, generatedAt: Date, navy: string, purple: string) {
  const x = document.page.margins.left;
  const width = document.page.width - document.page.margins.left - document.page.margins.right;
  document.save();
  document.rect(0, 0, document.page.width, 70).fill(navy);
  document.circle(x + 17, 35, 13).fill(purple);
  document.fillColor("#ffffff").font("Helvetica-Bold").fontSize(14).text("A", x + 12, 27);
  document.fillColor("#ffffff").fontSize(12).text("ADVAYA", x + 38, 24);
  document.fillColor("#c4b5fd").font("Helvetica").fontSize(8).text("COLLEGE UNION  •  FINANCIAL RECORD", x + 38, 42);
  document.fillColor("#ddd6fe").fontSize(8).text(`Generated ${formatDate(generatedAt)}`, x + width - 130, 31, { width: 130, align: "right" });
  document.restore();
  document.y = 84;
}

function drawMetric(document: PDFKit.PDFDocument, x: number, y: number, width: number, label: string, value: string, background: string, color: string) {
  document.roundedRect(x, y, width, 60, 9).fill(background);
  document.fillColor(color).font("Helvetica-Bold").fontSize(7.5).text(label, x + 10, y + 12);
  document.fillColor("#21152c").fontSize(15).text(value, x + 10, y + 29, { width: width - 20, ellipsis: true });
}

function drawTableHeader(document: PDFKit.PDFDocument, width: number, background: string, color: string) {
  const y = document.y;
  document.roundedRect(document.x, y, width, 24, 5).fill(background);
  document.fillColor(color).font("Helvetica-Bold").fontSize(7.5);
  document.text("DESCRIPTION", document.x + 8, y + 8);
  document.text("COLLECTION PERIOD", document.x + 205, y + 8);
  document.text("AMOUNT", document.x + width - 105, y + 8, { width: 97, align: "right" });
  document.y = y + 30;
}

function drawFooters(document: PDFKit.PDFDocument, siteUrl: string, generatedAt: Date, purple: string, muted: string) {
  const range = document.bufferedPageRange();
  for (let page = range.start; page < range.start + range.count; page++) {
    document.switchToPage(page);
    const y = document.page.height - 35;
    document.moveTo(document.page.margins.left, y - 8).lineTo(document.page.width - document.page.margins.right, y - 8).strokeColor("#e5dfeb").lineWidth(0.7).stroke();
    document.fillColor(purple).font("Helvetica-Bold").fontSize(8).text("ADVAYA", document.page.margins.left, y);
    document.fillColor(muted).font("Helvetica").text(siteUrl, document.page.margins.left + 52, y);
    document.text(`Page ${page + 1} of ${range.count}`, document.page.width - document.page.margins.right - 90, y, { width: 90, align: "right" });
  }
}

function money(value: number) {
  return `Rs. ${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatPeriod(start: Date, end: Date | null) {
  const from = formatDate(start);
  return end ? `${from} - ${formatDate(end)}` : from;
}

function formatDate(value: Date) {
  return value.getFullYear() < 1900 ? "Date not specified" : value.toLocaleDateString("en-IN", { dateStyle: "medium" });
}
