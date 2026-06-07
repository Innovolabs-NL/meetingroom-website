"use client";

import type { AppTeam } from "@/lib/app/get-app-context";
import { AppNavContent } from "./app-nav-content";
import { AppSidebarHeader } from "./app-sidebar-header";

export function AppSidebar({
  email,
  team,
  canCreateTeam,
}: {
  email?: string;
  team: AppTeam | null;
  canCreateTeam: boolean;
}) {
  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r border-border bg-[var(--color-navbar)] backdrop-blur-xl lg:flex">
      <AppSidebarHeader />
      <div className="flex min-h-0 flex-1 flex-col">
        <AppNavContent email={email} team={team} canCreateTeam={canCreateTeam} />
      </div>
    </aside>
  );
}
