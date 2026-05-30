import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { StaticPageShell } from "@/components/static-page-shell";
import { ArticleSections } from "@/components/article-sections";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "standalone" });
  return {
    title: t("privacy.meta.title"),
    description: t("privacy.meta.description"),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "standalone" });
  const sections = t.raw("privacy.sections") as { title: string; body: string }[];

  return (
    <StaticPageShell locale={locale}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("privacy.headline")}</h1>
      <p className="mt-2 text-sm text-muted">{t("privacy.updated")}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted">{t("privacy.disclaimer")}</p>
      <ArticleSections sections={sections} />
    </StaticPageShell>
  );
}
