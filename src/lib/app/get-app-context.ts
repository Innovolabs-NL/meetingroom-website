import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AppTeam = { id: string; name: string; slug: string; role: string };

export type AppContext = {
  configured: boolean;
  user: { id: string; email?: string; fullName?: string | null; company?: string | null } | null;
  accountKind: "personal" | "team";
  isTeamAccount: boolean;
  teams: AppTeam[];
  /** Team accounts are limited to one team; this is that team when it exists. */
  team: AppTeam | null;
  hasTeam: boolean;
  canCreateTeam: boolean;
  canDeleteAccount: boolean;
  soleOwnerTeamNames: string[];
  dbError: string | null;
};

type ProfileRow = {
  account_kind: "personal" | "team";
  full_name: string | null;
  company: string | null;
} | null;
type MembershipRow = { role: string; organizations: { id: string; name: string; slug: string } | null };

export async function getAppContext(): Promise<AppContext> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return {
      configured: false,
      user: null,
      accountKind: "personal",
      isTeamAccount: false,
      teams: [],
      team: null,
      hasTeam: false,
      canCreateTeam: false,
      canDeleteAccount: false,
      soleOwnerTeamNames: [],
      dbError: null,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      configured: true,
      user: null,
      accountKind: "personal",
      isTeamAccount: false,
      teams: [],
      team: null,
      hasTeam: false,
      canCreateTeam: false,
      canDeleteAccount: false,
      soleOwnerTeamNames: [],
      dbError: null,
    };
  }

  let { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("account_kind, full_name, company")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile && !profileErr) {
    const { error: insertErr } = await supabase.from("profiles").insert({ user_id: user.id });
    if (!insertErr) {
      const refetch = await supabase
        .from("profiles")
        .select("account_kind, full_name, company")
        .eq("user_id", user.id)
        .maybeSingle();
      profile = refetch.data;
      profileErr = refetch.error;
    } else {
      profileErr = insertErr;
    }
  }

  const { data: memberships, error: memErr } = await supabase
    .from("organization_members")
    .select("role, organizations(id, name, slug)")
    .eq("user_id", user.id);

  const accountKind = (profile as ProfileRow)?.account_kind ?? "personal";
  const isTeamAccount = accountKind === "team";
  const teams = ((memberships as MembershipRow[] | null) ?? [])
    .map((m) =>
      m.organizations
        ? { id: m.organizations.id, name: m.organizations.name, slug: m.organizations.slug, role: m.role }
        : null,
    )
    .filter((row): row is AppTeam => row !== null);
  const team = teams[0] ?? null;

  let soleOwnerTeamNames: string[] = [];
  const { data: soleOwnerRows, error: soleOwnerErr } = await supabase.rpc(
    "list_sole_owner_organizations",
  );

  if (!soleOwnerErr && soleOwnerRows) {
    soleOwnerTeamNames = (soleOwnerRows as { organization_name: string }[]).map(
      (r) => r.organization_name,
    );
  } else {
    for (const membership of teams.filter((row) => row.role === "owner")) {
      const { count } = await supabase
        .from("organization_members")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", membership.id)
        .eq("role", "owner");
      if (count === 1) soleOwnerTeamNames.push(membership.name);
    }
  }

  return {
    configured: true,
    user: {
      id: user.id,
      email: user.email,
      fullName: (profile as ProfileRow)?.full_name ?? null,
      company: (profile as ProfileRow)?.company ?? null,
    },
    accountKind,
    isTeamAccount,
    teams,
    team,
    hasTeam: team !== null,
    canCreateTeam: isTeamAccount && team === null,
    canDeleteAccount: soleOwnerTeamNames.length === 0,
    soleOwnerTeamNames,
    dbError: memErr?.message ?? profileErr?.message ?? null,
  };
}
