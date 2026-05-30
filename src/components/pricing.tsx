"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { usePaddle, openCheckout } from "@/lib/paddle";

const tiers = ["personal", "team", "enterprise"] as const;

export function Pricing() {
  const t = useTranslations("pricing");
  const paddle = usePaddle();

  function handleCheckout(tier: string) {
    if (tier === "enterprise") return;
    const envKey =
      tier === "personal"
        ? "NEXT_PUBLIC_PADDLE_PRICE_PERSONAL"
        : "NEXT_PUBLIC_PADDLE_PRICE_TEAM";
    const priceId = process.env[envKey] ?? "";
    openCheckout(paddle, priceId);
  }

  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-24 -z-10 h-64 bg-gradient-to-b from-accent/[0.04] via-transparent to-transparent blur-3xl" />

      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t("label")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{t("headline")}</h2>
          <p className="mt-4 text-lg text-muted">{t("subheadline")}</p>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {tiers.map((tier, i) => {
            const isPopular = tier === "team";
            const features: string[] = t.raw(`${tier}.features`);

            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] as const }}
                whileHover={{
                  y: -8,
                  transition: { type: "spring", stiffness: 260, damping: 20 },
                }}
                layout
                className={`relative flex flex-col rounded-2xl border p-8 backdrop-blur-sm ${
                  isPopular
                    ? "border-accent bg-accent/[0.08] shadow-xl shadow-accent/15 ring-1 ring-accent/25 lg:scale-[1.03] lg:z-10"
                    : "border-border bg-surface/80"
                }`}
              >
                {isPopular && (
                  <motion.span
                    animate={{ opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-accent/30"
                  >
                    {t(`${tier}.badge`)}
                  </motion.span>
                )}
                <h3 className="text-xl font-semibold">{t(`${tier}.name`)}</h3>
                <p className="mt-2 text-sm text-muted">{t(`${tier}.description`)}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{t(`${tier}.price`)}</span>
                  <span className="text-sm text-muted">{t(`${tier}.period`)}</span>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {features.map((feature: string) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35 }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="mt-0.5 shrink-0 text-accent"
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-muted">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  onClick={() => handleCheckout(tier)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`mt-8 flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                    isPopular
                      ? "bg-accent text-white shadow-lg shadow-accent/30 hover:bg-accent-hover"
                      : "border border-border text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {t(`${tier}.cta`)}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
