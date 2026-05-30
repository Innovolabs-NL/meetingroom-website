import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "@i18n/navigation";
import { getAppContext } from "@/lib/app/get-app-context";
import { CreateTeamForm } from "../../create-team-form";

export const dynamic = "force-dynamic";

/** Setup page — team accounts can only create one team, then redirect to it. */
export default async function TeamSetupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("appHub");
  const tShell = await getTranslations("appShell");
  const ctx = await getAppContext();

  if (!ctx.canCreateTeam) {
    if (ctx.hasTeam && ctx.team) {
      redirect({ href: `/app/t/${ctx.team.slug}`, locale });
    }
    redirect({ href: "/app", locale });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{tShell("setupTeamPageTitle")}</h1>
      <p className="mt-2 text-sm text-muted">{tShell("setupTeamPageSubtitle")}</p>

      {ctx.dbError ? (
        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-100">
          <p className="font-medium">{t("dbErrorTitle")}</p>
          <p className="mt-2 font-mono text-xs text-amber-200/90">{ctx.dbError}</p>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold tracking-tight">{t("createFirstTitle")}</h2>
          <p className="mt-2 text-sm text-muted">{t("createFirstHint")}</p>
          <CreateTeamForm />
        </div>
      )}
    </div>
  );
}
