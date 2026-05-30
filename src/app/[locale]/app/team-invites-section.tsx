"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { createOrganizationInvite, revokeOrganizationInvite } from "./team-actions";
import { InviteCopyLink } from "./invite-copy-link";

type InviteRow = {
  id: string;
  email: string;
  role: string;
  token: string;
  expires_at: string;
};

function inviteErrorLabel(t: ReturnType<typeof useTranslations>, code?: string): string | null {
  if (!code) return null;
  if (code === "INVALID_EMAIL") return t("errors.invalidEmail");
  if (code === "INVITE_ALREADY_PENDING") return t("errors.pendingDuplicate");
  if (code === "NOT_AUTHENTICATED") return t("errors.notAuthenticated");
  if (code === "EMAIL_NOT_CONFIGURED") return t("errors.emailNotConfigured");
  return t("errors.generic", { message: code });
}

export function TeamInvitesSection({
  locale,
  organizationId,
  organizationSlug,
  invites,
}: {
  locale: string;
  organizationId: string;
  organizationSlug: string;
  invites: InviteRow[];
}) {
  const t = useTranslations("appTeam");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteOk, setInviteOk] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [invitePending, startInvite] = useTransition();

  async function submitInvite(formData: FormData) {
    setInviteOk(false);
    setInviteError(null);
    startInvite(async () => {
      const result = await createOrganizationInvite(organizationId, organizationSlug, formData);
      if ("error" in result) {
        setInviteError(inviteErrorLabel(t, result.error) ?? result.error);
        return;
      }
      setEmailSent(result.emailSent);
      setInviteOk(true);
    });
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold tracking-tight">{t("inviteByEmail")}</h2>
        <p className="mt-1 text-sm text-muted">{t("invitesSubtitle")}</p>
        <form action={submitInvite} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input type="hidden" name="locale" value={locale} />
          <label className="block flex-1">
            <span className="text-xs text-muted">{t("email")}</span>
            <input
              name="email"
              type="email"
              required
              placeholder={t("emailPlaceholder")}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-border-light"
            />
          </label>
          <label className="block w-full sm:w-40">
            <span className="text-xs text-muted">{t("roleLabel")}</span>
            <select
              name="role"
              defaultValue="member"
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-border-light"
            >
              <option value="member">{t("roleMember")}</option>
              <option value="admin">{t("roleAdmin")}</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={invitePending}
            className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
          >
            {invitePending ? "…" : t("sendInvite")}
          </button>
        </form>

        {inviteError ? <p className="mt-3 text-sm text-red-300">{inviteError}</p> : null}
          {inviteOk ? (
            <p className="mt-3 text-sm text-emerald-300">
              {emailSent ? t("inviteEmailSent") : t("inviteEmailFailed")}
            </p>
          ) : null}
      </section>

      {invites.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-muted">{t("pendingInvites")}</h3>
          <ul className="mt-3 space-y-3">
            {invites.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="text-sm font-medium">{inv.email}</div>
                  <div className="mt-1 text-xs capitalize text-muted">
                    {inv.role} · {t("expires")}{" "}
                    {new Date(inv.expires_at).toLocaleDateString(locale)}
                  </div>
                  <InviteCopyLink locale={locale} token={inv.token} backup />
                </div>
                <form
                  action={async () => {
                    await revokeOrganizationInvite(inv.id, organizationSlug);
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-lg border border-border px-3 py-2 text-xs text-muted hover:bg-background hover:text-foreground"
                  >
                    {t("revokeInvite")}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
