import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@i18n/navigation";
import { getAppContext } from "@/lib/app/get-app-context";
import { CreateTeamForm } from "../create-team-form";

export const dynamic = "force-dynamic";

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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("overviewTitle")}</h1>
        <p className="mt-2 text-sm text-muted">
          {ctx.isTeamAccount ? t("overviewTeamSubtitle") : t("overviewMemberSubtitle")}
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <div className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
            {ctx.isTeamAccount ? t("accountKindTeam") : t("memberOfTeam", { team: team.name })}
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-tight">{team.name}</h2>
          <p className="mt-1 text-xs text-muted">
            {tHub("roleLabel")}: <span className="capitalize text-foreground/80">{team.role}</span>
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/app/t/${team.slug}`}
              className="inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              {canManage ? t("manageMembers") : t("viewTeam")}
            </Link>
            {canManage ? (
              <Link
                href={`/app/t/${team.slug}/invites`}
                className="inline-flex rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
              >
                {t("manageInvites")}
              </Link>
            ) : null}
          </div>
        </div>

        {!ctx.isTeamAccount ? (
          <div className="mt-8 rounded-2xl border border-border bg-surface/60 p-6">
            <h2 className="text-lg font-semibold tracking-tight">{t("gettingStartedTitle")}</h2>
            <p className="mt-2 text-sm text-muted">{t("memberDesktopHint")}</p>
            <Link
              href="/changelog"
              className="mt-5 inline-flex items-center justify-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-surface"
            >
              {t("downloadDesktop")}
            </Link>
          </div>
        ) : null}
      </div>
    );
  }

  if (ctx.canCreateTeam) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("overviewTitle")}</h1>
        <p className="mt-2 text-sm text-muted">{t("overviewTeamSetupSubtitle")}</p>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <div className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
            {t("accountKindTeam")}
          </div>
          <h2 className="mt-4 text-lg font-semibold tracking-tight">{tHub("createFirstTitle")}</h2>
          <p className="mt-2 text-sm text-muted">{tHub("createFirstHint")}</p>
          <CreateTeamForm />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{t("overviewTitle")}</h1>
      <p className="mt-2 text-sm text-muted">{t("overviewPersonalSubtitle")}</p>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <div className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
          {t("accountKindPersonal")}
        </div>
        <h2 className="mt-4 text-lg font-semibold tracking-tight">{t("personalCardTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("personalCardHint")}</p>
        <Link
          href="/changelog"
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/20 hover:bg-accent-hover"
        >
          {t("downloadDesktop")}
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold tracking-tight">{t("gettingStartedTitle")}</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>{t("gettingStartedStep1")}</li>
          <li>{t("gettingStartedStep2")}</li>
          <li>{t("gettingStartedStep3")}</li>
        </ol>
      </div>
    </div>
  );
}
