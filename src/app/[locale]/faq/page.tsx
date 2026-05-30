import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { StaticPageShell } from "@/components/static-page-shell";
import { FaqAccordion } from "@/components/faq-accordion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "standalone" });
  return {
    title: t("faq.meta.title"),
    description: t("faq.meta.description"),
  };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <StaticPageShell locale={locale}>
      <FaqAccordion layout="standalone" />
    </StaticPageShell>
  );
}
