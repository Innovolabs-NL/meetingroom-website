import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type TeamMember = {
  user_id: string;
  role: string;
  email: string | null;
  full_name: string | null;
  company: string | null;
  created_at: string;
};

export type TeamContext = {
  org: { id: string; name: string; slug: string };
  membership: { role: string };
  members: TeamMember[];
  invites: Array<{
    id: string;
    email: string;
    role: string;
    token: string;
    expires_at: string;
  }>;
  currentUserId: string;
  currentUserEmail?: string;
  canManage: boolean;
  isOwner: boolean;
  /** False when you are the only owner — transfer ownership or delete the team before leaving. */
  canLeaveTeam: boolean;
};

type RpcMemberRow = {
  user_id: string;
  role: string;
  email: string;
  full_name: string | null;
  company: string | null;
  joined_at: string;
};

export async function getTeamContext(slug: string): Promise<TeamContext> {
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) notFound();

  const { data: org, error: orgErr } = await supabase
    .from("organizations")
    .select("id, name, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (orgErr || !org) notFound();

  const { data: membership, error: membershipErr } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", org.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipErr || !membership) notFound();

  const { data: rpcMembers, error: rpcErr } = await supabase.rpc("list_organization_members", {
    p_organization_id: org.id,
  });

  let members: TeamMember[];

  if (!rpcErr && rpcMembers) {
    members = (rpcMembers as RpcMemberRow[]).map((m) => ({
      user_id: m.user_id,
      role: m.role,
      email: m.email,
      full_name: m.full_name,
      company: m.company,
      created_at: m.joined_at,
    }));
  } else {
    const { data: fallback, error: membersErr } = await supabase
      .from("organization_members")
      .select("user_id, role, created_at")
      .eq("organization_id", org.id)
      .order("created_at", { ascending: true });

    if (membersErr) notFound();

    members = (fallback ?? []).map((m) => ({
      user_id: m.user_id,
      role: m.role,
      email: m.user_id === user.id ? (user.email ?? null) : null,
      full_name: null,
      company: null,
      created_at: m.created_at,
    }));
  }

  const isOwner = membership.role === "owner";
  const canManage = isOwner || membership.role === "admin";
  const ownerCount = members.filter((m) => m.role === "owner").length;
  const canLeaveTeam = !isOwner || ownerCount > 1;

  let invites: TeamContext["invites"] = [];
  if (canManage) {
    const { data: inv } = await supabase
      .from("organization_invites")
      .select("id, email, role, token, expires_at")
      .eq("organization_id", org.id)
      .is("accepted_at", null)
      .order("created_at", { ascending: false });
    if (inv) invites = inv;
  }

  return {
    org,
    membership,
    members,
    invites,
    currentUserId: user.id,
    currentUserEmail: user.email,
    canManage,
    isOwner,
    canLeaveTeam,
  };
}
