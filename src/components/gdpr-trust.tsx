"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const pointKeys = ["local", "control", "minimize", "teams"] as const;

export function GdprTrust() {
  const t = useTranslations("gdpr");

  return (
    <section id="gdpr" className="border-y border-border bg-section py-24 md:py-28">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              </svg>
              {t("badge")}
            </motion.div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{t("headline")}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{t("description")}</p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"
          >
            {pointKeys.map((key, i) => (
              <motion.li
                key={key}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.08 + i * 0.05, duration: 0.45 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className="flex gap-4 rounded-xl card-surface p-5 transition-shadow hover:border-border-light hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/15">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">{t(`points.${key}.title`)}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{t(`points.${key}.description`)}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
