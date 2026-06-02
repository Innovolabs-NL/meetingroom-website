import { MobileWarningCallout } from "@/components/mobile-warning-callout";
import { AppButtonLink } from "./app-button-link";

/** On mobile: hint only. On md+: download button only. */
export function DesktopDownloadCta({
  href,
  label,
  mobileHint,
  variant = "primary",
  className = "",
}: {
  href: string;
  label: string;
  mobileHint: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="hidden md:block">
        <AppButtonLink href={href} variant={variant} className="w-full sm:w-auto">
          {label}
        </AppButtonLink>
      </div>
      <MobileWarningCallout>{mobileHint}</MobileWarningCallout>
    </div>
  );
}
