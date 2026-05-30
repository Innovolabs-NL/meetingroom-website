"use client";

import { motion } from "framer-motion";

const orbs = [
  { className: "left-[8%] top-[20%] h-72 w-72 glow-accent", delay: 0, duration: 18 },
  { className: "right-[5%] top-[12%] h-56 w-56 glow-violet", delay: 2, duration: 22 },
  { className: "left-[35%] bottom-[5%] h-48 w-48 glow-cyan", delay: 4, duration: 20 },
];

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`ambient-orb absolute rounded-full blur-3xl ${orb.className}`}
          initial={{ scale: 0.92 }}
          animate={{
            scale: [0.92, 1.05, 0.92],
            y: [0, -28, 0],
            x: [0, i % 2 === 0 ? 22 : -18, 0],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
