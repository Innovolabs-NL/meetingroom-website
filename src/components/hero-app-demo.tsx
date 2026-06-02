"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useHeroDemoData, type DemoTab } from "./hero-app-demo-data";
import { HeroDemoSummary } from "./hero-demo-summary";

const TABS: DemoTab[] = ["memo", "transcript", "summary"];

function IconBtn({
  children,
  label,
  onClick,
  pressed,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors ${
        pressed ? "bg-surface text-foreground" : "hover:bg-surface-hover hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function RoundIconBtn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-5 w-5 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-foreground"
    >
      {children}
    </button>
  );
}

export function HeroAppDemo() {
  const t = useTranslations("hero.demo");
  const { meetings, folder } = useHeroDemoData();
  const [activeId, setActiveId] = useState(meetings[0]?.id ?? "municipality");
  const [tab, setTab] = useState<DemoTab>("memo");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [demoToast, setDemoToast] = useState<string | null>(null);
  const [mapsExpanded, setMapsExpanded] = useState(true);

  const meeting = meetings.find((m) => m.id === activeId) ?? meetings[0];
  const tabLabels: Record<DemoTab, string> = {
    memo: t("tabMemo"),
    transcript: t("tabTranscript"),
    summary: t("tabSummary"),
  };
  function showDemoToast(message: string) {
    setDemoToast(message);
    window.setTimeout(() => setDemoToast(null), 2200);
  }

  return (
    <div
      className="hero-app-demo relative flex h-full min-h-[300px] w-full flex-col bg-background text-left text-foreground select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top bar — matches desktop center-header */}
      <header className="flex h-8 shrink-0 items-center border-b border-border bg-section px-1.5">
        <div className="flex items-center gap-0.5">
          <IconBtn
            label={t("toggleSidebar")}
            pressed={!sidebarCollapsed}
            onClick={() => setSidebarCollapsed((c) => !c)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M9 4v16" />
            </svg>
          </IconBtn>
          <IconBtn label={t("settings")} onClick={() => showDemoToast(t("recordHint"))}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </IconBtn>
        </div>
        <div className="min-h-0 flex-1" aria-hidden />
        <div className="flex items-center gap-0.5">
          <IconBtn label={t("share")} onClick={() => showDemoToast(t("recordHint"))}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51 15.42 17.49M8.59 10.49 15.42 6.51" />
            </svg>
          </IconBtn>
          <IconBtn
            label={t("toggleChat")}
            pressed={chatOpen}
            onClick={() => setChatOpen((o) => !o)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M15 4v16" />
            </svg>
          </IconBtn>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Left sidebar */}
        <aside
          className={`flex shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 ${
            sidebarCollapsed ? "w-0 overflow-hidden border-r-0" : "w-[38%] max-w-[220px] min-w-[148px]"
          }`}
        >
          <div className="p-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-2 py-1.5 shadow-inner">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="truncate text-[10px] text-muted">{t("searchPlaceholder")}</span>
            </div>
          </div>

          {/* Folders */}
          <div className="px-2">
            <div className="flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={() => setMapsExpanded((e) => !e)}
                className="flex min-w-0 flex-1 items-center gap-1 rounded-md py-0.5 text-[11px] font-semibold text-foreground/90"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`shrink-0 text-muted transition-transform ${mapsExpanded ? "" : "-rotate-90"}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                <span className="truncate">{t("folders")}</span>
                <span className="rounded-md bg-surface px-1.5 py-0.5 text-[9px] font-medium tabular-nums text-muted">
                  {folder.sectionCount}
                </span>
              </button>
              <RoundIconBtn label={t("createFolder")}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </RoundIconBtn>
            </div>
            {mapsExpanded ? (
              <button
                type="button"
                className="mt-1 flex w-full items-center justify-between rounded-lg border border-border/80 bg-section px-2 py-1.5 text-left text-[10px] text-muted hover:border-border-light"
              >
                <span className="truncate font-medium text-foreground/85">{folder.name}</span>
                <span className="ml-2 shrink-0 rounded bg-surface px-1.5 py-0.5 text-[9px] tabular-nums">
                  {folder.count}
                </span>
              </button>
            ) : null}
          </div>

          {/* Recent meetings */}
          <div className="mt-3 flex min-h-0 flex-1 flex-col px-2 pb-2">
            <div className="mb-1.5 flex items-center justify-between gap-1">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-foreground/90">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {t("recentMeetings")}
              </span>
              <div className="flex gap-0.5">
                <RoundIconBtn label={t("calendar")}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </RoundIconBtn>
                <RoundIconBtn label={t("newMeeting")}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </RoundIconBtn>
              </div>
            </div>
            <ul className="space-y-2 overflow-y-auto">
              {meetings.map((m) => {
                const active = m.id === activeId;
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(m.id);
                        if (m.memo) setTab("memo");
                        else if (m.transcript.length) setTab("transcript");
                      }}
                      className={`w-full rounded-xl border px-2.5 py-2 text-left transition-colors ${
                        active
                          ? "border-accent bg-accent-muted ring-1 ring-accent/25"
                          : "border-border/80 bg-section hover:border-accent/40 hover:bg-surface-hover"
                      }`}
                    >
                      <div className="truncate text-[11px] font-semibold leading-snug">{m.title}</div>
                      <div className="mt-1 truncate text-[9px] tabular-nums text-muted">{m.dateLabel}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Center editor */}
        <main className="relative flex min-w-0 flex-1 flex-col bg-background">
          <div className="flex shrink-0 items-center gap-2 border-b border-border/60 px-3 py-2">
            <div className="min-w-0 flex-1 truncate text-sm font-semibold leading-tight">{meeting.title}</div>
            <button
              type="button"
              className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1 text-[10px] font-medium text-muted"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              {t("mapsButton")}
            </button>
            <button type="button" aria-label={t("more")} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="1.75" />
                <circle cx="12" cy="12" r="1.75" />
                <circle cx="19" cy="12" r="1.75" />
              </svg>
            </button>
          </div>

          {tab === "memo" ? (
            <div className="flex shrink-0 flex-wrap items-center gap-1 border-b border-border/40 px-2 py-1.5">
              <button type="button" className="flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] text-foreground">
                {t("memoStyleNormal")}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <button type="button" className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] text-muted">
                14px
              </button>
              <span className="mx-0.5 h-4 w-px bg-border" />
              <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold text-muted hover:bg-surface">
                B
              </button>
              <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] italic text-muted hover:bg-surface">
                I
              </button>
              <span className="mx-0.5 h-4 w-px bg-border" />
              <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md text-muted hover:bg-surface" aria-hidden>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="4" cy="7" r="1.5" />
                  <circle cx="4" cy="12" r="1.5" />
                  <circle cx="4" cy="17" r="1.5" />
                  <rect x="8" y="6" width="12" height="2" rx="0.5" />
                  <rect x="8" y="11" width="12" height="2" rx="0.5" />
                  <rect x="8" y="16" width="12" height="2" rx="0.5" />
                </svg>
              </button>
              <button type="button" className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-muted hover:bg-surface">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>
          ) : null}

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2 pt-3 text-[11px] leading-relaxed">
            {tab === "memo" &&
              (meeting.memo ? (
                <p className="whitespace-pre-line text-foreground/90">{meeting.memo}</p>
              ) : (
                <p className="text-muted/70">{t("memoPlaceholder")}</p>
              ))}
            {tab === "transcript" && (
              <ul className="space-y-3">
                {meeting.transcript.map((row, i) => (
                  <li key={i}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold" style={{ color: row.color }}>
                        {row.speaker}
                      </span>
                      <span className="text-[9px] tabular-nums text-muted">{row.time}</span>
                    </div>
                    <p className="mt-0.5 text-foreground/85">{row.text}</p>
                  </li>
                ))}
              </ul>
            )}
            {tab === "summary" && <HeroDemoSummary summary={meeting.summary} />}
          </div>

          {/* Bottom chrome — pinned like desktop note-editor-bottom-chrome */}
          <div className="relative mt-auto shrink-0 px-3 pb-2.5 pt-8">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-t from-background to-transparent"
              aria-hidden
            />
            <div className="relative flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => showDemoToast(t("recordHint"))}
                aria-label={t("record")}
                className="inline-flex h-9 items-center gap-2.5 rounded-full border border-border bg-surface px-3.5 text-[11px] font-medium text-foreground/90 shadow-elevated transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                  <rect x="9" y="2" width="6" height="11" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0" />
                  <path d="M12 17v4M9 21h6" />
                </svg>
                <span>{t("startListening")}</span>
              </button>
              <div className="hero-app-demo-dock inline-flex items-center justify-center gap-[18px] rounded-xl border border-border bg-surface px-6 py-1">
                {TABS.map((key) => {
                  const active = tab === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTab(key)}
                      className={`border-b-2 px-0.5 py-1.5 text-[11px] font-semibold transition-colors ${
                        active ? "border-accent text-accent" : "border-transparent text-muted hover:text-foreground"
                      }`}
                    >
                      {tabLabels[key]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </main>

        {chatOpen ? (
          <aside className="flex w-[32%] max-w-[200px] min-w-[120px] shrink-0 flex-col border-l border-border bg-surface">
            <div className="border-b border-border/60 px-2 py-1.5 text-[10px] font-semibold">{t("chatTitle")}</div>
            <div className="flex flex-1 items-center justify-center p-3 text-center text-[10px] text-muted">
              {t("chatHint")}
            </div>
          </aside>
        ) : null}
      </div>

      {/* Status bar */}
      <footer className="flex h-6 shrink-0 items-center justify-between border-t border-border bg-section px-2.5 text-[9px] text-muted">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#24b56a]" aria-hidden />
          <span>{t("aiModelsReady")}</span>
        </div>
        <span>{t("saved")}</span>
      </footer>

      {demoToast ? (
        <div
          role="status"
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-border bg-surface px-3 py-1.5 text-[10px] font-medium text-foreground shadow-elevated"
        >
          {demoToast}
        </div>
      ) : null}
    </div>
  );
}
