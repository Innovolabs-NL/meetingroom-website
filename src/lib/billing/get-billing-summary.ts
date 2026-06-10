import { createServerSupabaseClient } from "@/lib/supabase/server";

export type BillingLimits = {
  meetings_per_month: number | null;
  can_export: boolean;
  can_share_team_templates: boolean;
};

export type BillingSummary = {
  enforcement_enabled: boolean;
  plan: string;
  status: string;
  source: string;
  current_period_end: string | null;
  limits: BillingLimits;
  meetings_used_this_month: number;
  upgrade_url: string;
  team?: {
    organization_id: string;
    organization_name: string;
    seat_count: number;
    seats_used: number;
    can_manage_billing: boolean;
  } | null;
};

export async function getBillingSummary(): Promise<BillingSummary | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: entitlements, error } = await supabase.rpc("get_effective_entitlements");
  if (error || !entitlements) return null;

  const base = entitlements as Omit<BillingSummary, "team">;

  type MembershipRow = {
    role: string;
    organization_id: string;
    organizations: { id: string; name: string } | null;
  };

  const { data: membership } = await supabase
    .from("organization_members")
    .select("role, organization_id, organizations(id, name)")
    .eq("user_id", user.id)
    .maybeSingle();

  const org = (membership as MembershipRow | null)?.organizations ?? null;
  const memberRole = (membership as MembershipRow | null)?.role;
  if (!org) {
    return { ...base, team: null };
  }

  const { count: seatsUsed } = await supabase
    .from("organization_members")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", org.id);

  const { data: orgEnt } = await supabase
    .from("organization_entitlements")
    .select("seat_count")
    .eq("organization_id", org.id)
    .maybeSingle();

  const canManage = memberRole === "owner" || memberRole === "admin";

  return {
    ...base,
    team: {
      organization_id: org.id,
      organization_name: org.name,
      seat_count: orgEnt?.seat_count ?? 0,
      seats_used: seatsUsed ?? 0,
      can_manage_billing: canManage,
    },
  };
}
