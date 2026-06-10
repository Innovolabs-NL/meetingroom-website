import { createHmac, timingSafeEqual } from "crypto";

export type PaddleCustomData = {
  user_id?: string;
  organization_id?: string;
  plan?: "personal" | "team";
};

export type PaddleSubscriptionPayload = {
  id?: string;
  status?: string;
  customer_id?: string;
  current_billing_period?: { ends_at?: string };
  custom_data?: PaddleCustomData;
  items?: Array<{ quantity?: number }>;
};

export type PaddleWebhookEvent = {
  event_id?: string;
  event_type?: string;
  occurred_at?: string;
  data?: PaddleSubscriptionPayload;
};

const ACTIVE_STATUSES = new Set(["active", "trialing", "past_due"]);
const CANCELED_STATUSES = new Set(["canceled", "paused"]);

export function verifyPaddleWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader || !secret) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(";").map((part) => {
      const [key, ...rest] = part.split("=");
      return [key?.trim(), rest.join("=").trim()];
    }),
  ) as Record<string, string>;

  const ts = parts.ts;
  const h1 = parts.h1;
  if (!ts || !h1) return false;

  const signed = `${ts}:${rawBody}`;
  const expected = createHmac("sha256", secret).update(signed).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(h1, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function mapPaddleStatus(status: string | undefined): string {
  const normalized = (status ?? "").toLowerCase();
  if (ACTIVE_STATUSES.has(normalized)) return normalized;
  if (CANCELED_STATUSES.has(normalized)) return "canceled";
  return normalized || "canceled";
}

export function seatCountFromSubscription(data: PaddleSubscriptionPayload): number {
  const qty = data.items?.[0]?.quantity;
  if (typeof qty === "number" && qty > 0) return qty;
  return 1;
}
