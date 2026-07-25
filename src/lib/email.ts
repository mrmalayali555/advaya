import "server-only";
import nodemailer from "nodemailer";

/**
 * Sends mail if SMTP is configured; otherwise logs to the console (dev-safe).
 * Returns true on success, false on failure — never throws to the caller.
 */
export async function sendMail({
  subject,
  text,
  html,
  to,
}: {
  subject: string;
  text: string;
  html?: string;
  to?: string;
}): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const recipient = to || process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL;

  if (!host || !recipient) {
    console.log(`[email:skipped] ${subject}\n${text}`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "ADVAYA <no-reply@advaya.local>",
      to: recipient,
      subject,
      text,
      html,
    });
    return true;
  } catch (err) {
    console.error("[email:error]", err);
    return false;
  }
}
