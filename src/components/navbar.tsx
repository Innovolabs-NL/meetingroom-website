"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { NavbarAuth } from "./navbar-auth";
import { ThemeToggle } from "./theme-toggle";

const MotionLink = motion.create(Link);

export function Navbar() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/#features", label: t("features") },
    { href: "/#gdpr", label: t("gdpr") },
    { href: "/#pricing", label: t("pricing") },
    { href: "/faq", label: t("faq") },
  ];

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-[var(--color-navbar)] backdrop-blur-xl navbar-shell"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <MotionLink
          href="/"
          className="flex items-center gap-2.5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            whileHover={{ rotate: [0, -6, 6, 0], transition: { duration: 0.5 } }}
            className="inline-flex"
          >
            <Image src="/logo.svg" alt="MeetingRoom" width={28} height={28} />
          </motion.span>
          <span className="text-lg font-semibold tracking-tight">MeetingRoom</span>
        </MotionLink>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <MotionLink
              key={link.href}
              href={link.href}
              className="group relative px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
              whileHover={{ y: -1 }}
            >
              {link.label}
              <span className="absolute bottom-1 left-3 right-3 h-px origin-left scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
            </MotionLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <NavbarAuth />
          <LanguageSwitcher />
        </div>

        <motion.button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center rounded-lg p-2 text-muted transition-colors hover:text-foreground md:hidden"
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <>
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </>
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-[var(--color-navbar)] backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((link, i) => (
                <MotionLink
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
                >
                  {link.label}
                </MotionLink>
              ))}
              <div className="mt-2 flex flex-col gap-3 border-t border-border/50 pt-4">
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <LanguageSwitcher
                    dropUp
                    onAfterSwitch={() => setMobileOpen(false)}
                  />
                </div>
                <div onClick={() => setMobileOpen(false)}>
                  <NavbarAuth mobile />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
