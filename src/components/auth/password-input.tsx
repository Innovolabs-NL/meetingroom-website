"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { authInputClass } from "./auth-field";

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  required,
  minLength,
  readOnly,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: "current-password" | "new-password";
  required?: boolean;
  minLength?: number;
  readOnly?: boolean;
}) {
  const t = useTranslations("auth");
  const [visible, setVisible] = useState(false);

  function reveal() {
    setVisible(true);
  }

  function conceal() {
    setVisible(false);
  }

  return (
    <div className="relative">
      <input
        id={id}
        className={`${authInputClass} pr-11`}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        readOnly={readOnly}
      />
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          reveal();
        }}
        onPointerUp={conceal}
        onPointerLeave={conceal}
        onPointerCancel={conceal}
        className={`absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 touch-none select-none items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground ${visible ? "bg-surface text-foreground" : ""}`}
        aria-label={t("holdToShowPassword")}
        tabIndex={-1}
      >
        {visible ? <EyeIcon /> : <EyeOffIcon />}
      </button>
    </div>
  );
}
