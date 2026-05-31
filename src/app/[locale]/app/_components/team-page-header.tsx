import { Link } from "@i18n/navigation";
import { getTranslations } from "next-intl/server";
import { MemberAvatar } from "./member-avatar";
import { RoleBadge, roleLabelKey } from "./role-badge";
import { TeamPageHeaderMotion } from "./team-page-header-motion";

export async function TeamPageHeader({
  name,
  slug,
  memberCount,
  yourRole,
  yourEmail,
  canManage,
}: {
  name: string;
  slug: string;
  memberCount: number;
  yourRole: string;
  yourEmail?: string;
  canManage: boolean;
}) {
  const t = await getTranslations("appTeam");
  const teamInitial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <TeamPageHeaderMotion>
    <header className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface via-surface to-background shadow-elevated">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border-light bg-background text-xl font-bold text-foreground shadow-inner">
            {teamInitial}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">{name}</h1>
            <p className="mt-1 text-sm text-muted">
              {t("memberCount", { count: memberCount })}
              <span className="mx-2 text-border-light">·</span>
              <span className="font-mono text-xs text-foreground/70">{slug}</span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted">{t("yourRoleLabel")}</span>
              <RoleBadge role={yourRole} label={t(roleLabelKey(yourRole))} />
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col flex-wrap items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          {yourEmail ? (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2">
              <MemberAvatar email={yourEmail} size="sm" />
              <span className="max-w-[12rem] truncate text-xs text-muted sm:max-w-none">{yourEmail}</span>
            </div>
          ) : null}
          {canManage ? (
            <Link
              href={`/app/t/${slug}/invites`}
              className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-colors hover:bg-accent-hover sm:w-auto"
            >
              {t("inviteMembers")}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
    </TeamPageHeaderMotion>
  );
}
