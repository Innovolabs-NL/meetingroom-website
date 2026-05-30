import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getAppContext } from "@/lib/app/get-app-context";
import { AccountDeleteSection } from "../../account-delete-section";
import { ProfileSettingsForm } from "../../profile-settings-form";
import { SignOutButton } from "../../signout-button";
import { AccountSecuritySection } from "../../account-security-section";

export const dynamic = "force-dynamic";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("appShell");
  const ctx = await getAppContext();

  const accountLabel =
    ctx.accountKind === "team" ? t("accountKindTeam") : t("accountKindPersonal");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{t("settingsTitle")}</h1>
      <p className="mt-2 text-sm text-muted">{t("settingsSubtitle")}</p>

      <div className="mt-8 space-y-6 rounded-2xl border border-border bg-surface p-6">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted">{t("settingsEmail")}</div>
          <div className="mt-1 text-sm">{ctx.user?.email ?? t("noEmail")}</div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted">{t("settingsAccountKind")}</div>
          <div className="mt-1 text-sm">{accountLabel}</div>
          <p className="mt-2 text-xs text-muted">{t("settingsAccountKindHint")}</p>
        </div>
        <ProfileSettingsForm
          initialFullName={ctx.user?.fullName ?? ""}
          initialCompany={ctx.user?.company ?? ""}
        />

        <AccountSecuritySection currentEmail={ctx.user?.email ?? ""} />

        <div className="border-t border-border pt-6">
          <SignOutButton />
        </div>
      </div>

      <AccountDeleteSection
        locale={locale}
        userEmail={ctx.user?.email ?? ""}
        canDelete={ctx.canDeleteAccount}
        soleOwnerTeamNames={ctx.soleOwnerTeamNames}
      />
    </div>
  );
}
