"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "../../i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t("product"),
      links: [
        { label: t("features"), href: "/#features" },
        { label: t("pricing"), href: "/#pricing" },
        { label: t("download"), href: "/#pricing" },
      ],
    },
    {
      title: t("resources"),
      links: [
        { label: t("faq"), href: "/faq" },
        { label: t("documentation"), href: "/documentation" },
        { label: t("changelog"), href: "/changelog" },
      ],
    },
    {
      title: t("legal"),
      links: [
        { label: t("privacy"), href: "/privacy" },
        { label: t("terms"), href: "/terms" },
        { label: t("contact"), href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border/50 bg-surface/30 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo.svg" alt="MeetingRoom" width={24} height={24} />
              <span className="text-base font-semibold">MeetingRoom</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {t("description")}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/50 pt-8">
          <p className="text-center text-xs text-muted">
            {t("copyright", { year: String(year) })}
          </p>
        </div>
      </div>
    </footer>
  );
}
