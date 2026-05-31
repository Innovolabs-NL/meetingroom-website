"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { authInputClass } from "@/components/auth/auth-field";
import { AuthAlert } from "@/components/auth/auth-alert";
import { updateProfile } from "./profile-actions";

export function ProfileSettingsForm({
  initialFullName,
  initialCompany,
}: {
  initialFullName: string;
  initialCompany: string;
}) {
  const t = useTranslations("appShell");
  const [fullName, setFullName] = useState(initialFullName);
  const [company, setCompany] = useState(initialCompany);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startSave] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    startSave(async () => {
      const fd = new FormData();
      fd.set("full_name", fullName);
      fd.set("company", company);
      const result = await updateProfile(fd);
      if ("error" in result) {
        setError(result.error === "FULL_NAME_REQUIRED" ? t("profileFullNameRequired") : result.error);
        return;
      }
      setSaved(true);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">{t("profileFullName")}</span>
        <input
          className={`${authInputClass} mt-1.5`}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          required
          minLength={2}
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">{t("profileCompany")}</span>
        <input
          className={`${authInputClass} mt-1.5`}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          autoComplete="organization"
          placeholder={t("profileCompanyPlaceholder")}
        />
      </label>

      {error ? <AuthAlert variant="error">{error}</AuthAlert> : null}
      {saved ? <AuthAlert variant="success">{t("profileSaved")}</AuthAlert> : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? t("profileSaving") : t("profileSave")}
      </button>
    </form>
  );
}
