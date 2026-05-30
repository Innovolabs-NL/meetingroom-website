"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function InviteCopyLink({
  locale,
  token,
  backup = false,
}: {
  locale: string;
  token: string;
  backup?: boolean;
}) {
  const t = useTranslations("appTeam");
  const [href, setHref] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const path = `${window.location.origin}/${locale}/app/join?token=${encodeURIComponent(token)}`;
    queueMicrotask(() => setHref(path));
  }, [locale, token]);

  async function copy() {
    if (!href) return;
    await navigator.clipboard.writeText(href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-3 max-w-full">
      <p className="text-xs text-muted">{backup ? t("inviteLinkBackup") : t("inviteLinkHint")}</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          readOnly
          value={href || "…"}
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-muted"
        />
        <button
          type="button"
          onClick={() => copy()}
          disabled={!href}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40"
        >
          {copied ? t("copied") : t("copyLink")}
        </button>
      </div>
    </div>
  );
}
