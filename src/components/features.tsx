"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { DriftOrb } from "./motion-decorations";

const featureKeys = [
  "transcription",
  "diarization",
  "summaries",
  "chat",
  "multilingual",
  "privacy",
] as const;

const icons: Record<string, React.ReactNode> = {
  transcription: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  ),
  diarization: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  summaries: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  chat: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
    </svg>
  ),
  multilingual: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  ),
  privacy: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

export function Features() {
  const t = useTranslations("features");

  return (
    <section id="features" className="relative overflow-hidden py-24 md:py-32">
      <DriftOrb
        className="section-orb absolute -right-32 top-1/4 h-[420px] w-[420px]"
        colorClass="glow-accent"
        x={[0, 28, -12, 0]}
        y={[0, -22, 14, 0]}
        scale={[1, 1.12, 1.05, 1]}
        duration={20}
      />
      <DriftOrb
        className="section-orb absolute -left-40 bottom-0 h-[360px] w-[360px]"
        colorClass="glow-violet"
        x={[0, -20, 16, 0]}
        y={[0, 24, -18, 0]}
        scale={[1, 1.08, 1, 1]}
        duration={22}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06, duration: 0.4 }}
            className="text-sm font-semibold uppercase tracking-widest text-accent"
          >
            {t("label")}
          </motion.p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("headline")}
          </h2>
          <p className="mt-4 text-lg text-muted">{t("subheadline")}</p>
        </motion.div>

        <div className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 32, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { type: "spring", stiffness: 320, damping: 18 },
              }}
              style={{ transformPerspective: 900 }}
              className="group relative rounded-2xl card-surface p-6 transition-all hover:border-accent/35 hover:shadow-md hover:shadow-accent/5"
            >
              <motion.div
                className="absolute inset-px rounded-[15px] bg-gradient-to-br from-accent/[0.07] via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
              <div className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/15 transition-colors group-hover:bg-accent/15 group-hover:ring-accent/25">
                {icons[key]}
              </div>
              <h3 className="relative text-lg font-semibold">{t(`${key}.title`)}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted">
                {t(`${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
