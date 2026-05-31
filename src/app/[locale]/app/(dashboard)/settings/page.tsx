import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getAppContext } from "@/lib/app/get-app-context";
import { AccountDeleteSection } from "../../account-delete-section";
import { ProfileSettingsForm } from "../../profile-settings-form";
import { SignOutButton } from "../../signout-button";
import { AccountSecuritySection } from "../../account-security-section";
import { AppPageHeader } from "../../_components/app-page-header";
import { AppPageMotion, AppStaggerItem, AppStaggerList } from "../../_components/app-page-motion";
import { AppSection } from "../../_components/app-section";

export const dynamic = "force-dynamic";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("appShell");
  const ctx = await getAppContext();

  const accountLabel =
    ctx.accountKind === "team" ? t("accountKindTeam") : t("accountKindPersonal");

  return (
    <AppPageMotion>
      <AppPageHeader title={t("settingsTitle")} subtitle={t("settingsSubtitle")} />

      <AppStaggerList>
        <AppStaggerItem>
          <AppSection title={t("profileSectionTitle")} description={t("profileSectionHint")} className="mt-8">
            <div className="space-y-4">
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
            </div>
          </AppSection>
        </AppStaggerItem>

        <AppStaggerItem>
          <AppSection title={t("settingsSecuritySectionTitle")} description={t("settingsSecuritySectionHint")}>
            <AccountSecuritySection currentEmail={ctx.user?.email ?? ""} />
          </AppSection>
        </AppStaggerItem>

        <AppStaggerItem>
          <AppSection title={t("settingsSessionSectionTitle")} description={t("settingsSessionSectionHint")}>
            <SignOutButton />
          </AppSection>
        </AppStaggerItem>

        <AppStaggerItem>
          <AccountDeleteSection
            locale={locale}
            userEmail={ctx.user?.email ?? ""}
            canDelete={ctx.canDeleteAccount}
            soleOwnerTeamNames={ctx.soleOwnerTeamNames}
          />
        </AppStaggerItem>
      </AppStaggerList>
    </AppPageMotion>
  );
}
