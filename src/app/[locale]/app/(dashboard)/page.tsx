import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getAppContext } from "@/lib/app/get-app-context";
import { CreateTeamForm } from "../create-team-form";
import { AppButtonLink } from "../_components/app-button-link";
import { AppCard } from "../_components/app-card";
import { AppPageHeader } from "../_components/app-page-header";
import { AppPageMotion, AppStaggerItem, AppStaggerList } from "../_components/app-page-motion";

export const dynamic = "force-dynamic";

const gettingStartedSteps = [
  { key: "gettingStartedStep1" as const, step: 1 },
  { key: "gettingStartedStep2" as const, step: 2 },
  { key: "gettingStartedStep3" as const, step: 3 },
];

export default async function OverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("appShell");
  const tHub = await getTranslations("appHub");
  const ctx = await getAppContext();

  if (ctx.dbError) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-100">
        <p className="font-medium">{t("dbErrorTitle")}</p>
        <p className="mt-2 font-mono text-xs text-amber-200/90">{ctx.dbError}</p>
        <p className="mt-3 text-xs text-amber-100/80">{t("dbErrorHint")}</p>
      </div>
    );
  }

  if (ctx.hasTeam && ctx.team) {
    const team = ctx.team;
    const canManage = team.role === "owner" || team.role === "admin";

    return (
      <AppPageMotion>
        <AppPageHeader
          title={t("overviewTitle")}
          subtitle={ctx.isTeamAccount ? t("overviewTeamSubtitle") : t("overviewMemberSubtitle")}
        />

        <AppStaggerList>
          <AppStaggerItem>
            <AppCard className="mt-8">
              <div className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
                {ctx.isTeamAccount ? t("accountKindTeam") : t("memberOfTeam", { team: team.name })}
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight">{team.name}</h2>
              <p className="mt-1 text-xs text-muted">
                {tHub("roleLabel")}: <span className="capitalize text-foreground/80">{team.role}</span>
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AppButtonLink href={`/app/t/${team.slug}`} className="w-full">
                  {canManage ? t("manageMembers") : t("viewTeam")}
                </AppButtonLink>
                {canManage ? (
                  <AppButtonLink href={`/app/t/${team.slug}/invites`} variant="secondary" className="w-full">
                    {t("manageInvites")}
                  </AppButtonLink>
                ) : null}
                <AppButtonLink
                  href={`/app/t/${team.slug}/settings`}
                  variant="secondary"
                  className={`w-full ${canManage ? "sm:col-span-2" : ""}`}
                >
                  {t("navTeamSettings")}
                </AppButtonLink>
              </div>
            </AppCard>
          </AppStaggerItem>

          {!ctx.isTeamAccount ? (
            <AppStaggerItem>
              <AppCard className="bg-surface/80">
                <h2 className="text-lg font-semibold tracking-tight">{t("gettingStartedTitle")}</h2>
                <p className="mt-2 text-sm text-muted">{t("memberDesktopHint")}</p>
                <AppButtonLink href="/changelog" variant="secondary" className="mt-5 w-full sm:w-auto">
                  {t("downloadDesktop")}
                </AppButtonLink>
              </AppCard>
            </AppStaggerItem>
          ) : null}
        </AppStaggerList>
      </AppPageMotion>
    );
  }

  if (ctx.canCreateTeam) {
    return (
      <AppPageMotion>
        <AppPageHeader title={t("overviewTitle")} subtitle={t("overviewTeamSetupSubtitle")} />

        <AppStaggerList>
          <AppStaggerItem>
            <AppCard className="mt-8">
              <div className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
                {t("accountKindTeam")}
              </div>
              <h2 className="mt-4 text-lg font-semibold tracking-tight">{tHub("createFirstTitle")}</h2>
              <p className="mt-2 text-sm text-muted">{tHub("createFirstHint")}</p>
              <CreateTeamForm />
            </AppCard>
          </AppStaggerItem>
        </AppStaggerList>
      </AppPageMotion>
    );
  }

  return (
    <AppPageMotion>
      <AppPageHeader title={t("overviewTitle")} subtitle={t("overviewPersonalSubtitle")} />

      <AppStaggerList>
        <AppStaggerItem>
          <AppCard className="mt-8">
            <div className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
              {t("accountKindPersonal")}
            </div>
            <h2 className="mt-4 text-lg font-semibold tracking-tight">{t("personalCardTitle")}</h2>
            <p className="mt-2 text-sm text-muted">{t("personalCardHint")}</p>
            <AppButtonLink href="/changelog" className="mt-5 w-full sm:w-auto">
              {t("downloadDesktop")}
            </AppButtonLink>
          </AppCard>
        </AppStaggerItem>

        <AppStaggerItem>
          <AppCard>
            <h2 className="text-lg font-semibold tracking-tight">{t("gettingStartedTitle")}</h2>
            <ol className="mt-5 space-y-4">
              {gettingStartedSteps.map(({ key, step }) => (
                <li key={key} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent-muted text-xs font-semibold text-accent">
                    {step}
                  </span>
                  <span className="pt-1 text-sm leading-relaxed text-muted">{t(key)}</span>
                </li>
              ))}
            </ol>
          </AppCard>
        </AppStaggerItem>
      </AppStaggerList>
    </AppPageMotion>
  );
}
