import { AuthCard } from "@/components/auth/auth-card";

/** Skeleton shown while auth forms resolve session or search params. */
export function AuthFormLoading() {
  return (
    <AuthCard>
      <div className="h-8 w-40 animate-pulse rounded-lg bg-background/80" />
      <div className="mt-6 space-y-4">
        <div className="h-12 animate-pulse rounded-xl bg-background/60" />
        <div className="h-12 animate-pulse rounded-xl bg-background/60" />
        <div className="h-11 animate-pulse rounded-xl bg-accent/20" />
      </div>
    </AuthCard>
  );
}
