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
    title: t("terms.meta.title"),
    description: t("terms.meta.description"),
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "standalone" });
  const sections = t.raw("terms.sections") as { title: string; body: string }[];

  return (
    <StaticPageShell locale={locale}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("terms.headline")}</h1>
      <p className="mt-2 text-sm text-muted">{t("terms.updated")}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted">{t("terms.disclaimer")}</p>
      <ArticleSections sections={sections} />
    </StaticPageShell>
  );
}
