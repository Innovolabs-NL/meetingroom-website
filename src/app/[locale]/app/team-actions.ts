"use server";

import { redirect } from "@i18n/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidateAppPaths } from "@/lib/app/revalidate-app";
import { sendInviteEmail } from "@/lib/email/send-invite-email";
import { orgHasAvailableSeat } from "@/lib/billing/seat-check";

function msg(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

export async function createOrganizationInvite(
  organizationId: string,
  orgSlug: string,
  formData: FormData,
): Promise<{ ok: true; emailSent: boolean } | { error: string }> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const roleRaw = String(formData.get("role") ?? "member");
  const role = roleRaw === "admin" ? "admin" : "member";
  const locale = String(formData.get("locale") ?? "en").trim() || "en";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "INVALID_EMAIL" };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "NOT_AUTHENTICATED" };

    const { data: org, error: orgErr } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", organizationId)
      .maybeSingle();

    if (orgErr || !org) return { error: orgErr?.message ?? "ORG_NOT_FOUND" };

    const hasSeat = await orgHasAvailableSeat(supabase, organizationId);
    if (!hasSeat) return { error: "TEAM_SEATS_FULL" };

    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    const { data: invite, error } = await supabase
      .from("organization_invites")
      .insert({
        organization_id: organizationId,
        email,
        role,
        invited_by: user.id,
        expires_at: expiresAt,
      })
      .select("token")
      .single();

    if (error) {
      if ((error as { code?: string }).code === "23505") {
        return { error: "INVITE_ALREADY_PENDING" };
      }
      return { error: error.message };
    }

    const sendResult = await sendInviteEmail({
      to: email,
      organizationName: org.name,
      role,
      token: invite.token,
      locale,
    });

    revalidateAppPaths(orgSlug);
    return { ok: true, emailSent: sendResult.ok };
  } catch (e) {
    return { error: msg(e) };
  }
}

export async function revokeOrganizationInvite(inviteId: string, orgSlug: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("organization_invites").delete().eq("id", inviteId);
    if (error) return { error: error.message };
    revalidateAppPaths(orgSlug);
    return { ok: true as const };
  } catch (e) {
    return { error: msg(e) };
  }
}

export async function leaveOrganization(
  organizationId: string,
  orgSlug: string,
  locale: string,
): Promise<{ error: string } | void> {
  let leaveError: string | undefined;

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "NOT_AUTHENTICATED" };

    const { data: membership, error: membershipErr } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", organizationId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipErr || !membership) return { error: "NOT_A_MEMBER" };

    if (membership.role === "owner") {
      const { count, error: countErr } = await supabase
        .from("organization_members")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", organizationId)
        .eq("role", "owner");

      if (countErr) return { error: countErr.message };
      if ((count ?? 0) <= 1) return { error: "SOLE_OWNER_CANNOT_LEAVE" };
    }

    const { error } = await supabase
      .from("organization_members")
      .delete()
      .eq("organization_id", organizationId)
      .eq("user_id", user.id);

    if (error) return { error: error.message };

    revalidateAppPaths(orgSlug);
  } catch (e) {
    leaveError = msg(e);
  }

  if (leaveError) return { error: leaveError };
  redirect({ href: "/app", locale });
}

function rpcErrorCode(message: string): string {
  if (
    message.includes("Could not find the function") ||
    message.includes("schema cache") ||
    message.includes("PGRST202")
  ) {
    return "RPC_NOT_APPLIED";
  }
  if (message.includes("NOT_AUTHENTICATED")) return "NOT_AUTHENTICATED";
  if (message.includes("NOT_OWNER")) return "NOT_OWNER";
  if (message.includes("TARGET_NOT_MEMBER")) return "TARGET_NOT_MEMBER";
  if (message.includes("ALREADY_OWNER")) return "ALREADY_OWNER";
  if (message.includes("INVALID_ROLE")) return "INVALID_ROLE";
  if (message.includes("CANNOT_CHANGE_OWNER")) return "CANNOT_CHANGE_OWNER";
  if (message.includes("CANNOT_CHANGE_SELF")) return "CANNOT_CHANGE_SELF";
  if (message.includes("NOT_A_MEMBER")) return "NOT_A_MEMBER";
  return message;
}

export async function updateOrganizationMemberRole(
  organizationId: string,
  orgSlug: string,
  memberUserId: string,
  role: "admin" | "member",
): Promise<{ ok: true } | { error: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "NOT_AUTHENTICATED" };

    const { error } = await supabase.rpc("update_organization_member_role", {
      p_organization_id: organizationId,
      p_member_user_id: memberUserId,
      p_role: role,
    });

    if (error) return { error: rpcErrorCode(error.message) };

    revalidateAppPaths(orgSlug);
    return { ok: true };
  } catch (e) {
    return { error: msg(e) };
  }
}

export async function transferOrganizationOwnership(
  organizationId: string,
  orgSlug: string,
  newOwnerUserId: string,
  password: string,
): Promise<{ ok: true } | { error: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "NOT_AUTHENTICATED" };
    if (!user.email) return { error: "NOT_AUTHENTICATED" };

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (signInError) {
      return { error: "INVALID_PASSWORD" };
    }

    const { error } = await supabase.rpc("transfer_organization_ownership", {
      p_organization_id: organizationId,
      p_new_owner_user_id: newOwnerUserId,
    });

    if (error) return { error: rpcErrorCode(error.message) };

    revalidateAppPaths(orgSlug);
    return { ok: true };
  } catch (e) {
    return { error: msg(e) };
  }
}

export async function deleteOrganization(
  organizationId: string,
  orgSlug: string,
  locale: string,
  confirmSlug: string,
): Promise<{ error: string } | void> {
  let deleteError: string | undefined;

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "NOT_AUTHENTICATED" };

    if (confirmSlug.trim() !== orgSlug) return { error: "SLUG_MISMATCH" };

    const { error } = await supabase.rpc("delete_organization", {
      p_organization_id: organizationId,
    });

    if (error) return { error: rpcErrorCode(error.message) };

    revalidateAppPaths(orgSlug);
  } catch (e) {
    deleteError = msg(e);
  }

  if (deleteError) return { error: deleteError };
  redirect({ href: "/app", locale });
}

export async function removeOrganizationMember(organizationId: string, orgSlug: string, memberUserId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "NOT_AUTHENTICATED" };
    if (memberUserId === user.id) return { error: "CANNOT_REMOVE_SELF" };

    const { data: target, error: targetErr } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", organizationId)
      .eq("user_id", memberUserId)
      .maybeSingle();

    if (targetErr) return { error: targetErr.message };
    if (!target) return { error: "NOT_A_MEMBER" };
    if (target.role === "owner") return { error: "CANNOT_REMOVE_OWNER" };

    const { error } = await supabase
      .from("organization_members")
      .delete()
      .eq("organization_id", organizationId)
      .eq("user_id", memberUserId);

    if (error) return { error: error.message };
    revalidateAppPaths(orgSlug);
    return { ok: true as const };
  } catch (e) {
    return { error: msg(e) };
  }
}
