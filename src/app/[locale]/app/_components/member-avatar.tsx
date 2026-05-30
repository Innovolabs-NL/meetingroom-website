import { avatarInitials, avatarStyle } from "@/lib/app/member-display";

export function MemberAvatar({
  email,
  fullName,
  size = "md",
}: {
  email?: string | null;
  fullName?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const seed = fullName?.trim() || email?.trim() || "?";
  const style = avatarStyle(seed);
  const sizeClass =
    size === "lg" ? "h-12 w-12 text-base" : size === "sm" ? "h-9 w-9 text-xs" : "h-10 w-10 text-sm";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sizeClass}`}
      style={style}
      aria-hidden
    >
      {avatarInitials(fullName, email)}
    </div>
  );
}
