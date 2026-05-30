import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthFormLoading } from "@/components/auth/auth-form-loading";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SignupForm } from "./signup-form";

export default async function SignupPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);

  let initialDesktopSessionEmail: string | null | undefined;
  if (sp.source === "desktop") {
    initialDesktopSessionEmail = null;
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      initialDesktopSessionEmail = session?.user.email?.trim() ?? null;
    } catch {
      initialDesktopSessionEmail = null;
    }
  }

  return (
    <AuthShell>
      <Suspense fallback={<AuthFormLoading />}>
        <SignupForm initialDesktopSessionEmail={initialDesktopSessionEmail} />
      </Suspense>
    </AuthShell>
  );
}
