"use client";

import type { Paddle } from "@paddle/paddle-js";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { openCheckout } from "@/lib/paddle";

export type BillingPlan = "personal" | "team";

export async function startPaddleCheckout(
  paddle: Paddle | null,
  plan: BillingPlan,
  options?: { organizationId?: string; quantity?: number; loginReturnPath?: string },
): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "sign_in_required" | "team_required" | "forbidden" }> {
  const envKey =
    plan === "personal" ? "NEXT_PUBLIC_PADDLE_PRICE_PERSONAL" : "NEXT_PUBLIC_PADDLE_PRICE_TEAM";
  const priceId = process.env[envKey] ?? "";
  if (!paddle || !priceId) return { ok: false, reason: "not_configured" };

  const supabase = createBrowserSupabaseClient();
  if (!supabase) return { ok: false, reason: "not_configured" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "sign_in_required" };

  if (plan === "team") {
    if (!options?.organizationId) return { ok: false, reason: "team_required" };

    const { data: membership } = await supabase
      .from("organization_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", options.organizationId)
      .maybeSingle();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return { ok: false, reason: "forbidden" };
    }
  }

  openCheckout(paddle, {
    priceId,
    quantity: options?.quantity ?? (plan === "team" ? 1 : 1),
    customerEmail: user.email ?? undefined,
    customData: {
      user_id: user.id,
      plan,
      ...(options?.organizationId ? { organization_id: options.organizationId } : {}),
    },
  });

  return { ok: true };
}
