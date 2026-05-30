This is the **MeetingRoom** marketing site ([Next.js](https://nextjs.org) App Router).

## Highlights

The UI uses [**Framer Motion**](https://www.framer.com/motion/) for scroll, hover, and decorative motion (gradient aurora, ripple rings, drifting orbs). Shared motion pieces live in [`src/components/motion-decorations.tsx`](./src/components/motion-decorations.tsx).

## Teams (Supabase)

Sign up / sign in and a minimal **team** UI live under `/[locale]/signup`, `/[locale]/login`, and `/[locale]/app` (protected). Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` (see [`.env.example`](./.env.example)).

Apply the database schema for teams to your Supabase project:

1. [`../supabase/migrations/20260527120000_teams_organizations.sql`](../supabase/migrations/20260527120000_teams_organizations.sql) — organizations + members  
2. [`../supabase/migrations/20260528100000_organization_invites.sql`](../supabase/migrations/20260528100000_organization_invites.sql) — email invites + RPC `accept_organization_invite`

Run both in order (SQL editor or Supabase CLI). The desktop app can use the same tables for seats and future billing sync.

**One-click (Dashboard):** paste the combined script [`../supabase/APPLY_teams_via_sql_editor.sql`](../supabase/APPLY_teams_via_sql_editor.sql) into **Supabase → SQL Editor → Run** (same effect as the two migration files).

## Separate GitHub repo + Vercel

This directory can be the **root** of its own GitHub repository and connect to **Vercel** without the rest of the monorepo.

- **Step-by-step:** [`DEPLOY.md`](./DEPLOY.md) (repo creation, `git subtree split`, Vercel import, domains).
- **Environment variables:** copy from [`.env.example`](./.env.example) into the Vercel project (Paddle, Supabase for auth/teams, optional GitHub token for changelog API limits).

## Getting started (local)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Changelog (`/changelog`)

The changelog route loads **GitHub Releases** for `Innovolabs-NL/meetingroom-releases` (configurable) with about **5 minute** revalidation. If the API is unavailable, it falls back to optional `mirror/latest.json` on disk and the static list in `messages/*.json`.

---

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) with [**Plus Jakarta Sans**](https://fonts.google.com/specimen/Plus+Jakarta+Sans).

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
