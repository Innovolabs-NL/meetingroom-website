const roleStyles: Record<string, string> = {
  owner: "border-amber-500/30 bg-amber-500/15 text-amber-100",
  admin: "border-accent/30 bg-accent/15 text-blue-100",
  member: "border-border bg-background/80 text-muted",
};

export function RoleBadge({ role, label }: { role: string; label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleStyles[role] ?? roleStyles.member}`}
    >
      {label}
    </span>
  );
}

export function roleLabelKey(role: string): "roleOwner" | "roleAdmin" | "roleMember" {
  if (role === "owner") return "roleOwner";
  if (role === "admin") return "roleAdmin";
  return "roleMember";
}
