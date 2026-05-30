"use server";

import { redirect } from "@i18n/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidateAppPaths } from "@/lib/app/revalidate-app";

export async function updateProfile(
  formData: FormData,
): Promise<{ ok: true } | { error: string }> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();

  if (fullName.length < 2) {
    return { error: "FULL_NAME_REQUIRED" };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "NOT_AUTHENTICATED" };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      company: company || null,
    })
    .eq("user_id", user.id);

  if (profileError) return { error: profileError.message };

  await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      company: company || null,
    },
  });

  revalidateAppPaths();
  return { ok: true };
}

export async function deleteAccount(
  locale: string,
  password: string,
): Promise<{ error: string } | void> {
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

  const { error } = await supabase.rpc("delete_own_account");

  if (error) {
    const message = error.message ?? "";
    if (message.includes("SOLE_OWNER_CANNOT_DELETE")) {
      return { error: "SOLE_OWNER_CANNOT_DELETE" };
    }
    if (message.includes("NOT_AUTHENTICATED")) {
      return { error: "NOT_AUTHENTICATED" };
    }
    return { error: message };
  }

  await supabase.auth.signOut({ scope: "local" });
  redirect({ href: "/", locale });
}
