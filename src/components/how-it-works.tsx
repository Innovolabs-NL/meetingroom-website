"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { RippleField } from "./motion-decorations";

const steps = [
  {
    key: "step1",
    rings: 3,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "step2",
    rings: 4,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    key: "step3",
    rings: 3,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section className="relative overflow-hidden border-y border-border/50 bg-surface/50 py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 max-w-2xl -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t("label")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{t("headline")}</h2>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const }}
              whileHover={{ y: -4 }}
              className="relative text-center"
            >
              <div className="relative mx-auto mb-6 flex h-[7.5rem] w-[7.5rem] items-center justify-center overflow-hidden rounded-2xl border border-border/80 bg-background/60 shadow-inner">
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.12] via-transparent to-violet-500/10"
                  animate={{ opacity: [0.65, 1, 0.65] }}
                  transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                />
                <RippleField rings={step.rings} className="opacity-70" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/25 backdrop-blur-[2px]">
                  <span className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white shadow-md shadow-accent/30">
                    {i + 1}
                  </span>
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold">{t(`${step.key}.title`)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t(`${step.key}.description`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
