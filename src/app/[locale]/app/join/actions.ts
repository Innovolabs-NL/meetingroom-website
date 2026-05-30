"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidateAppPaths } from "@/lib/app/revalidate-app";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function acceptOrganizationInviteAction(
  token: string,
): Promise<{ ok: true; slug: string } | { error: string }> {
  const normalized = token.trim();
  if (!UUID_RE.test(normalized)) {
    return { error: "INVITE_INVALID_OR_EXPIRED" };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "NOT_AUTHENTICATED" };

    const { data, error } = await supabase.rpc("accept_organization_invite", {
      p_token: normalized,
    });

    if (error) {
      const msg = error.message ?? "UNKNOWN";
      if (msg.includes("INVITE_EMAIL_MISMATCH")) return { error: "INVITE_EMAIL_MISMATCH" };
      if (msg.includes("INVITE_INVALID_OR_EXPIRED")) return { error: "INVITE_INVALID_OR_EXPIRED" };
      if (msg.includes("SIGN_IN_EMAIL_REQUIRED")) return { error: "SIGN_IN_EMAIL_REQUIRED" };
      if (msg.includes("NOT_AUTHENTICATED")) return { error: "NOT_AUTHENTICATED" };
      return { error: msg };
    }

    const slug = typeof data === "string" ? data : null;
    if (!slug) return { error: "INVITE_INVALID_OR_EXPIRED" };

    revalidateAppPaths(slug);
    return { ok: true, slug };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "UNKNOWN" };
  }
}
