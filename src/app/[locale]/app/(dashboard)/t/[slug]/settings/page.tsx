import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getTeamContext } from "@/lib/app/get-team-context";
import { RoleBadge, roleLabelKey } from "../../../../_components/role-badge";
import { TeamPageHeader } from "../../../../_components/team-page-header";
import { TeamDeleteSection } from "../../../../team-delete-section";
import { TeamLeaveSection } from "../../../../team-leave-section";
import { TeamTransferOwnershipSection } from "../../../../team-transfer-ownership-section";

export const dynamic = "force-dynamic";

export default async function TeamSettingsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("appShell");
  const tTeam = await getTranslations("appTeam");
  const team = await getTeamContext(slug);

  return (
    <div className="space-y-8">
      <TeamPageHeader
        name={team.org.name}
        slug={team.org.slug}
        memberCount={team.members.length}
        yourRole={team.membership.role}
        yourEmail={team.currentUserEmail}
        canManage={team.canManage}
      />

      <section className="rounded-2xl border border-border bg-surface/50 p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight">{t("teamSettingsTitle")}</h2>
        <p className="mt-1 text-sm text-muted">{t("teamSettingsSubtitle")}</p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background/50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">{t("teamSettingsName")}</dt>
            <dd className="mt-2 text-base font-medium">{team.org.name}</dd>
          </div>
          <div className="rounded-xl border border-border bg-background/50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">{t("teamSettingsSlug")}</dt>
            <dd className="mt-2 font-mono text-sm text-foreground/90">{team.org.slug}</dd>
          </div>
          <div className="rounded-xl border border-border bg-background/50 p-4 sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">{t("teamSettingsYourRole")}</dt>
            <dd className="mt-2">
              <RoleBadge
                role={team.membership.role}
                label={tTeam(roleLabelKey(team.membership.role))}
              />
            </dd>
          </div>
        </dl>
      </section>

      {team.isOwner ? (
        <>
          <TeamTransferOwnershipSection
            organizationId={team.org.id}
            organizationSlug={team.org.slug}
            userEmail={team.currentUserEmail ?? ""}
            candidates={team.members.filter((m) => m.user_id !== team.currentUserId)}
          />
          <TeamDeleteSection
            organizationId={team.org.id}
            organizationSlug={team.org.slug}
            teamName={team.org.name}
            locale={locale}
          />
        </>
      ) : null}

      <TeamLeaveSection
        organizationId={team.org.id}
        organizationSlug={team.org.slug}
        locale={locale}
        canLeave={team.canLeaveTeam}
      />
    </div>
  );
}
