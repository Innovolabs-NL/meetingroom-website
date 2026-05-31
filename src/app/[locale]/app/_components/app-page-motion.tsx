"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function AppPageMotion({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }
      }
    >
      {children}
    </motion.div>
  );
}

export function AppStaggerList({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className="space-y-4">{children}</div>;
  }

  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function AppStaggerItem({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      variants={staggerItem}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {children}
    </motion.div>
  );
}
