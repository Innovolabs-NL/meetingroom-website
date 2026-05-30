export function emailInitials(email: string): string {
  const local = (email.split("@")[0] ?? email).trim();
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

export function nameInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
  }
  return fullName.trim().slice(0, 2).toUpperCase();
}

export function avatarInitials(fullName: string | null | undefined, email: string | null | undefined): string {
  if (fullName?.trim()) return nameInitials(fullName);
  if (email?.trim()) return emailInitials(email);
  return "?";
}

export function avatarStyle(seed: string): { background: string; color: string } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % 360;
  }
  const hue = hash;
  return {
    background: `hsl(${hue} 45% 28%)`,
    color: `hsl(${hue} 70% 88%)`,
  };
}

export function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function memberDisplayName(
  fullName: string | null | undefined,
  email: string | null | undefined,
): string {
  if (fullName?.trim()) return fullName.trim();
  if (email?.trim()) return displayNameFromEmail(email);
  return "";
}
