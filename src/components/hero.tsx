"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FloatingOrbs } from "./floating-orbs";
import { HeroAppDemo } from "./hero-app-demo";

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const locale = useLocale();
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      <FloatingOrbs />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ambient-orb absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full glow-accent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p
            variants={fadeUp}
            className="relative mb-6 inline-flex items-center gap-2 overflow-hidden rounded-full border border-accent/30 bg-accent-muted px-4 py-1.5 text-sm font-semibold text-accent-soft"
          >
            <span
              className="pointer-events-none absolute inset-0 animate-shimmer-border"
              aria-hidden
            />
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="relative shrink-0"
              aria-hidden
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            </svg>
            <span className="relative">{t("badge")}</span>
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            {t("headline")}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
          >
            {t("subheadline")}
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-shadow hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/35"
            >
              {t("cta")}
            </motion.a>
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-surface px-8 text-base font-medium text-foreground shadow-sm transition-colors hover:bg-surface-hover"
            >
              {t("ctaSecondary")}
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 48, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
          style={{ perspective: 1200 }}
          className="mt-12 w-full md:mt-20"
        >
          <motion.div
            whileHover={{ y: -6, transition: { duration: 0.35 } }}
            className="mx-auto w-full overflow-hidden rounded-xl border border-border bg-surface shadow-elevated sm:rounded-2xl"
          >
            <div className="flex items-center gap-2 border-b border-border bg-section px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] sm:h-3 sm:w-3" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e] sm:h-3 sm:w-3" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#28c840] sm:h-3 sm:w-3" />
              <span className="ml-2 text-[11px] font-medium text-muted sm:ml-3 sm:text-xs">MeetingRoom</span>
            </div>
            <div className="hero-app-demo-frame relative overflow-hidden bg-gradient-to-b from-section to-background">
              <HeroAppDemo key={locale} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
