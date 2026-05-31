import { setRequestLocale } from "next-intl/server";
import { HelpPageContent } from "./help-page-content";

export const dynamic = "force-dynamic";

export default async function HelpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HelpPageContent />;
}
