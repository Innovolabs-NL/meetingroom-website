"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidateAppPaths } from "@/lib/app/revalidate-app";

export type CreateTeamState = { error?: string; ok?: boolean; slug?: string };

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err && "message" in err) {
    return String((err as { message: string }).message);
  }
  return "Unknown error";
}

export async function createTeamAction(
  _prev: CreateTeamState | null,
  formData: FormData,
): Promise<CreateTeamState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "TEAM_NAME_REQUIRED" };

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) return { error: userError.message };
    if (!user) return { error: "NOT_AUTHENTICATED" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("account_kind")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile?.account_kind === "team") {
      const { count, error: countErr } = await supabase
        .from("organization_members")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (countErr) return { error: countErr.message };
      if ((count ?? 0) >= 1) return { error: "TEAM_LIMIT_REACHED" };
    }

    const baseSlug = slugify(name) || "team";

    for (let attempt = 0; attempt < 3; attempt++) {
      const slug =
        attempt === 0 ? baseSlug : `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({ name, slug, created_by: user.id })
        .select("id, slug")
        .single();

      if (orgError) {
        if ((orgError as { code?: string }).code === "23505") continue;
        return { error: orgError.message };
      }

      const { error: memberError } = await supabase.from("organization_members").insert({
        organization_id: org.id,
        user_id: user.id,
        role: "owner",
      });

      if (memberError) return { error: memberError.message };

      await supabase
        .from("profiles")
        .update({ account_kind: "team" })
        .eq("user_id", user.id);

      revalidateAppPaths(org.slug);
      return { ok: true, slug: org.slug };
    }

    return { error: "TEAM_SLUG_CONFLICT" };
  } catch (e) {
    return { error: errorMessage(e) };
  }
}
