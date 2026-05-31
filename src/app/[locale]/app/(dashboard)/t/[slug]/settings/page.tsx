import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getTeamContext } from "@/lib/app/get-team-context";
import { RoleBadge, roleLabelKey } from "../../../../_components/role-badge";
import { TeamPageHeader } from "../../../../_components/team-page-header";
import { TeamDeleteSection } from "../../../../team-delete-section";
import { TeamLeaveSection } from "../../../../team-leave-section";
import { TeamTransferOwnershipSection } from "../../../../team-transfer-ownership-section";
import { AppPageMotion, AppStaggerItem, AppStaggerList } from "../../../../_components/app-page-motion";
import { AppSection } from "../../../../_components/app-section";

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
    <AppPageMotion>
      <div className="space-y-8">
        <TeamPageHeader
          name={team.org.name}
          slug={team.org.slug}
          memberCount={team.members.length}
          yourRole={team.membership.role}
          yourEmail={team.currentUserEmail}
          canManage={team.canManage}
        />

        <AppSection title={t("teamSettingsTitle")} description={t("teamSettingsSubtitle")}>
          <dl className="grid gap-4 sm:grid-cols-2">
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
        </AppSection>

        <AppStaggerList>
          {team.isOwner ? (
            <>
              <AppStaggerItem>
                <TeamTransferOwnershipSection
                  organizationId={team.org.id}
                  organizationSlug={team.org.slug}
                  userEmail={team.currentUserEmail ?? ""}
                  candidates={team.members.filter((m) => m.user_id !== team.currentUserId)}
                />
              </AppStaggerItem>
              <AppStaggerItem>
                <TeamDeleteSection
                  organizationId={team.org.id}
                  organizationSlug={team.org.slug}
                  teamName={team.org.name}
                  locale={locale}
                />
              </AppStaggerItem>
            </>
          ) : null}

          <AppStaggerItem>
            <TeamLeaveSection
              organizationId={team.org.id}
              organizationSlug={team.org.slug}
              locale={locale}
              canLeave={team.canLeaveTeam}
            />
          </AppStaggerItem>
        </AppStaggerList>
      </div>
    </AppPageMotion>
  );
}
