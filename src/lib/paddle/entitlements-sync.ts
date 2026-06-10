import type { SupabaseClient } from "@supabase/supabase-js";

import {
  mapPaddleStatus,
  seatCountFromSubscription,
  type PaddleSubscriptionPayload,
} from "./webhook";

function parsePeriodEnd(data: PaddleSubscriptionPayload): string | null {
  const endsAt = data.current_billing_period?.ends_at;
  return endsAt ?? null;
}

export async function upsertPersonalEntitlement(
  admin: SupabaseClient,
  userId: string,
  data: PaddleSubscriptionPayload,
): Promise<void> {
  const status = mapPaddleStatus(data.status);
  const { error } = await admin.from("user_entitlements").upsert(
    {
      user_id: userId,
      plan: status === "canceled" ? "free" : "personal",
      status,
      source: "paddle",
      paddle_customer_id: data.customer_id ?? null,
      paddle_subscription_id: data.id ?? null,
      current_period_end: parsePeriodEnd(data),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) throw error;
}

export async function upsertTeamEntitlement(
  admin: SupabaseClient,
  organizationId: string,
  data: PaddleSubscriptionPayload,
): Promise<void> {
  const status = mapPaddleStatus(data.status);
  const seatCount = status === "canceled" ? 0 : seatCountFromSubscription(data);
  const { error } = await admin.from("organization_entitlements").upsert(
    {
      organization_id: organizationId,
      plan: "team",
      status,
      seat_count: seatCount,
      source: "paddle",
      paddle_customer_id: data.customer_id ?? null,
      paddle_subscription_id: data.id ?? null,
      current_period_end: parsePeriodEnd(data),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "organization_id" },
  );
  if (error) throw error;
}

export async function syncSubscriptionEvent(
  admin: SupabaseClient,
  data: PaddleSubscriptionPayload,
): Promise<void> {
  const custom = data.custom_data ?? {};
  const plan = custom.plan;

  if (plan === "team" && custom.organization_id) {
    await upsertTeamEntitlement(admin, custom.organization_id, data);
    return;
  }

  if (custom.user_id) {
    await upsertPersonalEntitlement(admin, custom.user_id, data);
  }
}
