import { createServerSupabaseClient } from "@/lib/supabase/server";

export type InvitePreview = {
  email: string;
  organization_name: string;
  organization_slug: string;
  role: string;
  expires_at: string;
  already_accepted: boolean;
};

export type InvitePreviewResult =
  | { status: "ok"; preview: InvitePreview }
  | { status: "missing_token" }
  | { status: "bad_token" }
  | { status: "not_found" }
  | { status: "rpc_missing"; detail: string }
  | { status: "rpc_error"; detail: string }
  | { status: "config" };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function loadInvitePreview(token: string | null | undefined): Promise<InvitePreviewResult> {
  const normalized = token?.trim();
  if (!normalized) return { status: "missing_token" };
  if (!UUID_RE.test(normalized)) return { status: "bad_token" };

  let supabase;
  try {
    supabase = await createServerSupabaseClient();
  } catch {
    return { status: "config" };
  }

  const { data, error } = await supabase.rpc("get_organization_invite_preview", {
    p_token: normalized,
  });

  if (error) {
    const msg = error.message ?? "";
    const missing =
      error.code === "42883" ||
      msg.includes("does not exist") ||
      msg.includes("Could not find the function");
    if (missing) return { status: "rpc_missing", detail: msg };
    return { status: "rpc_error", detail: msg };
  }

  const row = (data as InvitePreview[] | null)?.[0];
  if (!row) return { status: "not_found" };

  return { status: "ok", preview: row };
}
