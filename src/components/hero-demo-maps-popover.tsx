"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { DemoMap } from "./hero-app-demo-data";

const DEMO_MAP_COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#06b6d4", "#f97316", "#22c55e"] as const;

function FolderIcon({ color }: { color?: string }) {
  return (
    <span
      className="hero-demo-map-row-icon relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface text-muted"
      style={
        color
          ? {
              color,
              background: `color-mix(in srgb, ${color} 14%, var(--color-surface))`,
            }
          : undefined
      }
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
      {color ? (
        <span
          className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      ) : null}
    </span>
  );
}

function MapRow({
  map,
  mode,
  onClick,
}: {
  map: DemoMap;
  mode: "assigned" | "available";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`hero-demo-map-row group flex w-full min-h-[2.375rem] items-center gap-2.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-left text-[0.92em] transition-colors hover:border-accent/35 ${
        mode === "assigned" ? "hero-demo-map-row--assigned bg-accent-muted/40" : ""
      }`}
    >
      <FolderIcon color={map.color} />
      <span className="min-w-0 flex-1 truncate font-medium text-foreground/90">{map.name}</span>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-base leading-none ${
          mode === "assigned"
            ? "text-muted group-hover:bg-danger-muted group-hover:text-danger"
            : "bg-accent-muted text-accent"
        }`}
        aria-hidden
      >
        {mode === "assigned" ? "×" : "+"}
      </span>
    </button>
  );
}

type HeroDemoMapsPopoverProps = {
  maps: DemoMap[];
  assignedIds: string[];
  onToggleAssign: (mapId: string) => void;
  onCreateMap: (name: string) => void;
  onClose: () => void;
};

export function HeroDemoMapsPopover({
  maps,
  assignedIds,
  onToggleAssign,
  onCreateMap,
  onClose,
}: HeroDemoMapsPopoverProps) {
  const t = useTranslations("hero.demo");
  const rootRef = useRef<HTMLDivElement>(null);
  const createInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [createName, setCreateName] = useState("");

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [onClose]);

  useEffect(() => {
    if (creating) createInputRef.current?.focus();
  }, [creating]);

  const assignedSet = useMemo(() => new Set(assignedIds), [assignedIds]);
  const normalizedQuery = query.trim().toLowerCase();

  const assigned = useMemo(
    () =>
      maps.filter(
        (m) =>
          assignedSet.has(m.id) &&
          (!normalizedQuery || m.name.toLowerCase().includes(normalizedQuery)),
      ),
    [maps, assignedSet, normalizedQuery],
  );

  const available = useMemo(
    () =>
      maps.filter(
        (m) =>
          !assignedSet.has(m.id) &&
          (!normalizedQuery || m.name.toLowerCase().includes(normalizedQuery)),
      ),
    [maps, assignedSet, normalizedQuery],
  );

  function submitCreate() {
    const name = createName.trim();
    if (!name) {
      setCreating(false);
      setCreateName("");
      return;
    }
    if (maps.some((m) => m.name.toLowerCase() === name.toLowerCase())) {
      createInputRef.current?.focus();
      return;
    }
    onCreateMap(name);
    setCreateName("");
    setCreating(false);
  }

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label={t("mapsButton")}
      className="hero-demo-maps-popover absolute right-0 top-full z-30 mt-1 w-[min(300px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-surface shadow-elevated"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="border-b border-border/60 bg-section/80 px-3 py-2.5">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("mapsSearchPlaceholder")}
            className="min-w-0 flex-1 bg-transparent text-[0.92em] text-foreground outline-none placeholder:text-muted"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="max-h-[min(360px,40vh)] overflow-y-auto px-2 py-2">
        {assigned.length > 0 ? (
          <section className="pb-2">
            <h4 className="mb-2 px-1 text-[0.82em] font-semibold text-muted">{t("mapsOnMeeting")}</h4>
            <ul className="flex flex-col gap-1">
              {assigned.map((map) => (
                <li key={map.id}>
                  <MapRow map={map} mode="assigned" onClick={() => onToggleAssign(map.id)} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {available.length > 0 ? (
          <section className={assigned.length > 0 ? "border-t border-border/50 pt-2" : ""}>
            <h4 className="mb-2 px-1 text-[0.82em] font-semibold text-muted">{t("mapsAddSection")}</h4>
            <ul className="flex flex-col gap-1">
              {available.map((map) => (
                <li key={map.id}>
                  <MapRow map={map} mode="available" onClick={() => onToggleAssign(map.id)} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {assigned.length === 0 && available.length === 0 ? (
          <p className="px-2 py-3 text-center text-[0.88em] text-muted">{t("mapsEmpty")}</p>
        ) : null}
      </div>

      <div className="border-t border-border/60 bg-section/60 p-2">
        {creating ? (
          <div className="flex flex-col gap-1.5">
            <input
              ref={createInputRef}
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder={t("mapsNamePlaceholder")}
              maxLength={100}
              className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-[0.92em] text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitCreate();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  setCreating(false);
                  setCreateName("");
                }
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-accent/35 bg-accent-muted px-3 py-2 text-[0.88em] font-semibold text-accent transition-colors hover:bg-accent-muted/80"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {t("mapsCreateCta")}
          </button>
        )}
      </div>
    </div>
  );
}

export function nextDemoMapColor(index: number): string {
  return DEMO_MAP_COLORS[index % DEMO_MAP_COLORS.length];
}
