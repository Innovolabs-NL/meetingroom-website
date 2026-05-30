"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AuroraWash } from "./motion-decorations";

export function CTASection() {
  const t = useTranslations("cta");

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="relative overflow-hidden rounded-3xl border border-border bg-surface px-8 py-16 text-center shadow-elevated md:px-16 md:py-20"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent/8 blur-3xl" />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-95 md:opacity-100">
            <AuroraWash intensity="normal" />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/80 to-transparent" />

          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              {t("headline")}
            </motion.h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{t("subheadline")}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.a
                href="#pricing"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-white shadow-lg shadow-accent/35"
              >
                {t("download")}
              </motion.a>
              <motion.a
                href="#pricing"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.99 }}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-surface px-8 text-base font-medium text-muted transition-colors hover:border-accent/35 hover:bg-surface-hover hover:text-foreground"
              >
                {t("forTeams")}
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
