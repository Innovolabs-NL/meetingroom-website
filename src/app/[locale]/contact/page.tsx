import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { StaticPageShell } from "@/components/static-page-shell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "standalone" });
  return {
    title: t("contact.meta.title"),
    description: t("contact.meta.description"),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "standalone" });

  return (
    <StaticPageShell locale={locale}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("contact.headline")}</h1>
      <p className="mt-4 text-muted leading-relaxed">{t("contact.intro")}</p>

      <div className="mt-10 space-y-8 rounded-xl border border-border bg-surface/40 p-6 md:p-8">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            {t("contact.supportLabel")}
          </h2>
          <a
            href={`mailto:${t("contact.supportEmail")}`}
            className="mt-2 inline-block text-lg font-medium text-accent transition-colors hover:text-accent-hover"
          >
            {t("contact.supportEmail")}
          </a>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            {t("contact.salesLabel")}
          </h2>
          <a
            href={`mailto:${t("contact.salesEmail")}`}
            className="mt-2 inline-block text-lg font-medium text-accent transition-colors hover:text-accent-hover"
          >
            {t("contact.salesEmail")}
          </a>
        </div>
        <p className="text-sm text-muted">{t("contact.hours")}</p>
      </div>
    </StaticPageShell>
  );
}
