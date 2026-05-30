"use client";

import { authInputClass } from "./auth-field";

export function normalizeVerificationCode(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 8);
}

export function VerificationCodeInput({
  id,
  value,
  onChange,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <input
      id={id}
      className={`${authInputClass} text-center font-mono text-lg tracking-[0.35em]`}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]*"
      maxLength={8}
      value={value}
      onChange={(e) => onChange(normalizeVerificationCode(e.target.value))}
      disabled={disabled}
      required
      minLength={6}
    />
  );
}
