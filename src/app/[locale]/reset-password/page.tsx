import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthFormLoading } from "@/components/auth/auth-form-loading";
import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AuthShell>
      <Suspense fallback={<AuthFormLoading />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
