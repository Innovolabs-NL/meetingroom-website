"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FloatingOrbs } from "./floating-orbs";
import { AuroraWash, RippleField } from "./motion-decorations";

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
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      <FloatingOrbs />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/8 blur-3xl" />
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
            whileHover={{ scale: 1.02 }}
            className="relative mb-6 inline-flex items-center gap-2 overflow-hidden rounded-full border border-border bg-surface/80 px-4 py-1.5 text-sm text-muted backdrop-blur-sm"
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
              className="relative text-accent"
              aria-hidden
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            </svg>
            <span className="relative">{t("badge")}</span>
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
          >
            {t("headline")}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg leading-relaxed text-muted md:text-xl"
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
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-shadow hover:shadow-xl hover:shadow-accent/35"
            >
              {t("cta")}
            </motion.a>
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.02, borderColor: "rgba(59,130,246,0.5)" }}
              whileTap={{ scale: 0.99 }}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-8 text-base font-medium text-muted transition-colors hover:text-foreground"
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
          className="mt-16 md:mt-20"
        >
          <motion.div
            whileHover={{ y: -6, transition: { duration: 0.35 } }}
            className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl ring-1 ring-white/5"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-muted">MeetingRoom</span>
            </div>
            <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-surface via-background to-surface p-8 md:p-12">
              <div className="absolute inset-0 opacity-90 md:opacity-100">
                <AuroraWash intensity="normal" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-70" />
              <motion.div
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
                className="relative z-10 mx-auto flex max-w-sm flex-col items-center text-center"
              >
                <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 shadow-lg shadow-accent/10 md:h-28 md:w-28">
                <div className="absolute inset-0">
                  <RippleField rings={4} />
                </div>
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="relative text-accent drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground/90">
                  {t("appScreenshot")}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
