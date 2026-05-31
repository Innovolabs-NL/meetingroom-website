import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getTeamContext } from "@/lib/app/get-team-context";
import { TeamPageHeader } from "../../../_components/team-page-header";
import { TeamMembersSection } from "../../../team-members-section";
import { AppPageMotion } from "../../../_components/app-page-motion";

export const dynamic = "force-dynamic";

export default async function TeamMembersPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("appTeam");
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

        <section className="overflow-hidden rounded-2xl border border-border bg-surface/50 shadow-elevated">
          <div className="border-b border-border px-4 py-5 sm:px-6">
            <h2 className="text-lg font-semibold tracking-tight">{t("members")}</h2>
            <p className="mt-1 text-sm text-muted">{t("membersSubtitle")}</p>
          </div>
          <TeamMembersSection
            organizationId={team.org.id}
            organizationSlug={team.org.slug}
            members={team.members}
            currentUserId={team.currentUserId}
            canManage={team.canManage}
            isOwner={team.isOwner}
          />
        </section>
      </div>
    </AppPageMotion>
  );
}
