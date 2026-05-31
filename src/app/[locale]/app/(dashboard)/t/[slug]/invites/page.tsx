import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTeamContext } from "@/lib/app/get-team-context";
import { TeamPageHeader } from "../../../../_components/team-page-header";
import { TeamInvitesSection } from "../../../../team-invites-section";
import { AppPageMotion } from "../../../../_components/app-page-motion";

export const dynamic = "force-dynamic";

export default async function TeamInvitesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const team = await getTeamContext(slug);

  if (!team.canManage) notFound();

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

        <section className="overflow-hidden rounded-2xl border border-border bg-surface/50 p-4 shadow-elevated sm:p-8">
          <TeamInvitesSection
            locale={locale}
            organizationId={team.org.id}
            organizationSlug={team.org.slug}
            invites={team.invites}
          />
        </section>
      </div>
    </AppPageMotion>
  );
}
