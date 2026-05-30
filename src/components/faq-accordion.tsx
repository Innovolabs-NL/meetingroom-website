"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

type FaqAccordionProps = {
  layout?: "landing" | "standalone";
};

export function FaqAccordion({ layout = "landing" }: FaqAccordionProps) {
  const t = useTranslations("faq");
  const items: { question: string; answer: string }[] = t.raw("items");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const Title = layout === "landing" ? "h2" : "h1";

  const header = (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
      className="text-center"
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t("label")}</p>
      <Title className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{t("headline")}</Title>
    </motion.div>
  );

  const list = (
    <div className="mt-12 space-y-3">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.35) }}
          layout
          className="overflow-hidden rounded-xl border border-border bg-background/90 shadow-sm backdrop-blur-sm transition-shadow hover:border-border-light hover:shadow-md"
        >
          <motion.button
            layout
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            whileTap={{ scale: 0.995 }}
            className="flex w-full items-center justify-between px-6 py-5 text-left text-sm font-medium transition-colors hover:text-accent"
          >
            {item.question}
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="shrink-0 text-muted"
            >
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
          </motion.button>
          <AnimatePresence initial={false} mode="popLayout">
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1] as const,
                  opacity: { duration: 0.2 },
                }}
                className="overflow-hidden"
              >
                <div className="border-t border-border px-6 pb-5 pt-4 text-sm leading-relaxed text-muted">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );

  if (layout === "landing") {
    return (
      <section id="faq" className="border-t border-border/50 bg-surface/50 py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          {header}
          {list}
        </div>
      </section>
    );
  }

  return (
    <div>
      {header}
      {list}
    </div>
  );
}
