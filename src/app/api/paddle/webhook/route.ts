import { NextResponse } from "next/server";

import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";
import { syncSubscriptionEvent } from "@/lib/paddle/entitlements-sync";
import {
  verifyPaddleWebhookSignature,
  type PaddleWebhookEvent,
} from "@/lib/paddle/webhook";

const HANDLED_EVENTS = new Set([
  "subscription.created",
  "subscription.updated",
  "subscription.canceled",
  "subscription.past_due",
  "subscription.activated",
]);

export async function POST(request: Request) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature");

  if (!verifyPaddleWebhookSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: PaddleWebhookEvent;
  try {
    event = JSON.parse(rawBody) as PaddleWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.event_type ?? "";
  if (!HANDLED_EVENTS.has(eventType) || !event.data) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const admin = createServiceRoleSupabaseClient();
  if (!admin) {
    return NextResponse.json({ error: "Supabase admin not configured" }, { status: 503 });
  }

  try {
    await syncSubscriptionEvent(admin, event.data);
  } catch (err) {
    console.error("[paddle/webhook]", eventType, err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
