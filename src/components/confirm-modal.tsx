"use client";

import { useEffect, useId } from "react";

export type ConfirmModalVariant = "default" | "danger";

export function ConfirmModal({
  open,
  title,
  description,
  cancelLabel,
  confirmLabel,
  pendingLabel,
  pending = false,
  variant = "default",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  pendingLabel?: string;
  pending?: boolean;
  variant?: ConfirmModalVariant;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onCancel();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, pending, onCancel]);

  if (!open) return null;

  const isDanger = variant === "danger";
  const confirmText = pending && pendingLabel ? pendingLabel : confirmLabel;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !pending) onCancel();
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-10 w-full max-w-md rounded-2xl border bg-surface p-6 shadow-2xl shadow-black/40 ${
          isDanger ? "border-red-500/30" : "border-border"
        }`}
      >
        <h2
          id={titleId}
          className={`text-lg font-semibold tracking-tight ${isDanger ? "text-red-100" : "text-foreground"}`}
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={pending}
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-background disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className={
              isDanger
                ? "inline-flex h-10 items-center justify-center rounded-xl border border-red-500/50 bg-red-500/20 px-4 text-sm font-semibold text-red-100 transition-colors hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                : "inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            }
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
