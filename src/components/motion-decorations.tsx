"use client";

import { motion } from "framer-motion";

/** Soft drifting blobs (hero / CTA / large surfaces). */
export function AuroraWash({
  className = "",
  intensity = "normal",
}: {
  className?: string;
  intensity?: "subtle" | "normal" | "strong";
}) {
  const strengthVar =
    intensity === "subtle"
      ? "--aurora-strength-subtle"
      : intensity === "strong"
        ? "--aurora-strength-strong"
        : "--aurora-strength-normal";
  const blobs: {
    className: string;
    mx: number[];
    my: number[];
  }[] = [
    { className: "left-[-10%] top-[-20%] h-[85%] w-[70%] glow-accent", mx: [-12, 18, -8], my: [-16, 10, -6] },
    { className: "bottom-[-30%] right-[-15%] h-[75%] w-[65%] glow-violet", mx: [10, -14, 6], my: [8, -12, 14] },
    { className: "left-[20%] bottom-[-25%] h-[55%] w-[50%] glow-cyan", mx: [-18, 12, -10], my: [-8, 16, -4] },
  ];
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={`absolute rounded-full blur-3xl ${b.className}`}
          style={{ opacity: `var(${strengthVar})` }}
          animate={{
            x: b.mx,
            y: b.my,
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 14 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.2,
          }}
        />
      ))}
    </div>
  );
}

/** Expanding ring ripples behind a focal UI element. */
export function RippleField({
  rings = 3,
  className = "",
}: {
  rings?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}
      aria-hidden
    >
      {Array.from({ length: rings }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border border-accent/25 bg-accent/5"
          style={{
            width: `${5.5 + i * 3.25}rem`,
            height: `${5.5 + i * 3.25}rem`,
          }}
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{
            opacity: [0.45, 0],
            scale: [0.82, 1.55],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            delay: i * 0.75,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
        />
      ))}
    </div>
  );
}

/** Large blurred orb for section corners (features / GDPR). */
export function DriftOrb({
  className,
  colorClass,
  x,
  y,
  scale,
  duration = 18,
}: {
  className?: string;
  colorClass: string;
  x: number[];
  y: number[];
  scale?: number[];
  duration?: number;
}) {
  return (
    <motion.div
      aria-hidden
      className={`rounded-full blur-3xl ${colorClass} ${className ?? ""}`}
      animate={{
        x,
        y,
        ...(scale ? { scale } : {}),
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
