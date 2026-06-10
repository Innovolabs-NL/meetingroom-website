import type { SupabaseClient } from "@supabase/supabase-js";

const PAID_STATUSES = new Set(["active", "trialing", "past_due"]);

export async function orgHasAvailableSeat(
  supabase: SupabaseClient,
  organizationId: string,
): Promise<boolean> {
  const { data: cfg } = await supabase
    .from("app_config")
    .select("billing_enforcement_enabled")
    .eq("id", 1)
    .maybeSingle();

  if (!cfg?.billing_enforcement_enabled) return true;

  const { data: ent } = await supabase
    .from("organization_entitlements")
    .select("seat_count, status")
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (!ent || !PAID_STATUSES.has(ent.status) || ent.seat_count <= 0) {
    return false;
  }

  const { count: memberCount } = await supabase
    .from("organization_members")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", organizationId);

  const { count: pendingCount } = await supabase
    .from("organization_invites")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString());

  const used = (memberCount ?? 0) + (pendingCount ?? 0);
  return used < ent.seat_count;
}
