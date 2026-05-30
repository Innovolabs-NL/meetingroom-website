# Separate GitHub repo + Vercel

The MeetingRoom marketing site lives in this folder. It does **not** depend on the rest of the monorepo at runtime (changelog reads **GitHub Releases** first; `mirror/latest.json` is optional).

The live site repo: **`https://github.com/Innovolabs-NL/meetingroom-website`**

## 1. Create a new GitHub repository

For a **greenfield** repo, use GitHub: **New repository** → `meetingroom-website` → empty, no README (you will push from git).

*(The Innovolabs repo above is already populated from this folder as its own git root.)*

### Option A — Publish only `website/` from the monorepo (subtree split)

From the parent repo (`meetingroom`), publish the `website` subdirectory as its own branch, then push:

```bash
# From repo root (not inside website/) — requires `website/` to be committed on that branch
git subtree split -P website -b meetingroom-website-split
git remote add meetingroom-website https://github.com/Innovolabs-NL/meetingroom-website.git
git push meetingroom-website meetingroom-website-split:main
git remote remove meetingroom-website
git branch -D meetingroom-website-split
```

Later updates:

```bash
git subtree split -P website -b meetingroom-website-split
git push https://github.com/Innovolabs-NL/meetingroom-website.git meetingroom-website-split:main
git branch -D meetingroom-website-split
```

If **`website/` only has a nested `.git`** (never committed in the monorepo), subtree split will not include it — keep using `meetingroom-website` directly, or commit `website/` in the monorepo first, or add `website/` to the monorepo `.gitignore` so the two copies do not fight.

### Option B — One-off copy

Copy everything **inside** `website/` (not the parent repo) into a new directory, then:

```bash
cd meetingroom-website
git init
git add .
git commit -m "Initial import: MeetingRoom marketing site"
git branch -M main
git remote add origin https://github.com/Innovolabs-NL/meetingroom-website.git
git push -u origin main
```

Exclude `node_modules/` and `.next/` (they are gitignored here).

### Option C — `gh` CLI

```bash
gh repo create Innovolabs-NL/meetingroom-website --public --source=. --remote=origin --push
```

Run this from a directory that contains **only** the website project root.

## 2. Deploy on Vercel

1. Sign in at [vercel.com](https://vercel.com) and click **Add New… → Project**.
2. **Import** your new GitHub repo `YOUR_ORG/meetingroom-website`.
3. Framework: **Next.js** (auto-detected). Root directory: **`.`** (leave default if the repo root is the Next app).
4. Build: `npm run build` (default), output `.next` (default).
5. Under **Environment Variables**, add the variables from [`.env.example`](./.env.example) for **Production** (and Preview if needed).

| Variable | When |
|----------|------|
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | Required for Paddle checkout |
| `NEXT_PUBLIC_PADDLE_ENVIRONMENT` | `sandbox` or `production` |
| `NEXT_PUBLIC_PADDLE_PRICE_PERSONAL` | Price ID for Personal |
| `NEXT_PUBLIC_PADDLE_PRICE_TEAM` | Price ID for Team |
| `GITHUB_RELEASES_TOKEN` or `GITHUB_TOKEN` | Optional; higher GitHub API limits for changelog |

6. **Deploy**. Vercel assigns a `*.vercel.app` URL; add your custom domain under **Settings → Domains**.

## 3. Behaviour on Vercel-only repo

- **Changelog** loads from the public GitHub API (`Innovolabs-NL/meetingroom-releases` by default) and revalidates every 5 minutes — no `mirror/` folder required.
- **`mirror/latest.json`** fallback only applies if that path exists on disk (typically local monorepo builds).

## 4. Keeping monorepo + website repo in sync

Pick one workflow:

- **Subtree pushes** (Option A) when you ship website changes from the main monorepo, or  
- **Edit the standalone repo only** if the marketing site is maintained separately.
