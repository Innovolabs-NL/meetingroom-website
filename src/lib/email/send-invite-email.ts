import nodemailer from "nodemailer";
import { inviteJoinUrl } from "@/lib/site-url";

export type SendInviteEmailInput = {
  to: string;
  organizationName: string;
  role: "admin" | "member";
  token: string;
  locale: string;
};

export type SendInviteEmailResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "send_error"; detail?: string };

function getSmtpTransport() {
  const host = process.env.SMTP_HOST?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!host || !from) return null;

  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER?.trim();
  const pass = (process.env.SMTP_PASSWORD ?? process.env.SMTP_PASS)?.trim();
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  return {
    from,
    transport: nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    }),
  };
}

export async function sendInviteEmail(input: SendInviteEmailInput): Promise<SendInviteEmailResult> {
  const smtp = getSmtpTransport();
  if (!smtp) {
    return { ok: false, reason: "not_configured" };
  }

  const joinUrl = inviteJoinUrl(input.locale, input.token);
  const roleLabel = input.role === "admin" ? "Admin" : "Member";
  const subject = `You're invited to join ${input.organizationName} on MeetingRoom`;

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#0f172a;max-width:520px">
      <p style="margin:0 0 16px">You've been invited to join <strong>${escapeHtml(input.organizationName)}</strong> on MeetingRoom as <strong>${roleLabel}</strong>.</p>
      <p style="margin:0 0 24px">Create an account (or sign in) with <strong>${escapeHtml(input.to)}</strong>, then accept the invitation.</p>
      <p style="margin:0 0 24px">
        <a href="${joinUrl}" style="display:inline-block;background:#3b82f6;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600">
          Accept invitation
        </a>
      </p>
      <p style="margin:0;font-size:13px;color:#64748b">If the button doesn't work, open this link:<br />
        <a href="${joinUrl}" style="color:#3b82f6;word-break:break-all">${joinUrl}</a>
      </p>
      <p style="margin:24px 0 0;font-size:12px;color:#94a3b8">This invitation expires in 14 days.</p>
    </div>
  `.trim();

  const text = [
    `You've been invited to join ${input.organizationName} on MeetingRoom (${roleLabel}).`,
    ``,
    `Sign up or sign in with ${input.to}, then open:`,
    joinUrl,
    ``,
    `This invitation expires in 14 days.`,
  ].join("\n");

  try {
    await smtp.transport.sendMail({
      from: smtp.from,
      to: input.to,
      subject,
      html,
      text,
    });
    return { ok: true };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: "send_error", detail: detail.slice(0, 500) };
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
