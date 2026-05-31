"use client";

import { AuroraWash } from "@/components/motion-decorations";

export function AppShellMain({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <AuroraWash intensity="subtle" />
      </div>
      {children}
    </div>
  );
}
