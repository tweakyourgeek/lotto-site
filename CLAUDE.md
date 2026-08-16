# CLAUDE.md - Instructions for Claude Code

## CRITICAL: Check Existing Branches First!

**Before writing ANY code, always run:**
```bash
git fetch --all
git branch -a
```

This repository may have feature branches with existing work. DO NOT assume this is a new/empty project.

---

## Project Structure

This is **lotto-site** - "The Lottery Reality Check": a lead-magnet web app for Tweak Your Geek that asks visitors what they would do with a billion dollars, then walks them through taxes, debts, lifestyle spending, and investment projections to show what their dream life actually costs. It captures an email address partway through, produces a downloadable PDF report, and records anonymous usage stats in an admin analytics dashboard. A second, smaller "Dream Life Calculator" app lives in its own folder inside the same repo.

**Key files:**
- `app/page.tsx` - The main calculator experience visitors see.
- `app/admin/page.tsx` - The password/login-protected analytics dashboard.
- `app/api/` - The server routes: `analytics` (usage tracking), `email` (lead capture), `pdf` (report generation), `admin` (dashboard data).
- `lib/calculations.ts` and `lib/constants.ts` - The tax and spending math, and the state-by-state tax tables.
- `lib/db/schema.sql` - The PostgreSQL tables that store analytics; this must be run by hand against the database.
- `middleware.ts` - Protects `/admin` with Clerk login, but only if Clerk is configured; otherwise it lets requests through.
- `dream-life-calculator/` - A **separate, standalone Next.js app** with its own `package.json`, deployed independently.
- `DEPLOYMENT.md` and `DATABASE_SETUP.md` - Step-by-step deployment and database setup guides.

---

## Before Starting Any Work

1. **Fetch all branches:** `git fetch --all && git branch -a`
2. **Check what exists:** Look at files in the current branch AND other branches
3. **Ask the user** if you're unsure which branch has the latest work
4. **Never recreate** something that already exists on another branch

---

## User's GitHub

- Username: `tweakyourgeek`
- Environment: Windows PC
- Git tool: GitHub Desktop
- Communication: GitHub web interface (provide links!)

---

## Workflow Rules (CRITICAL - Follow These!)

### 1. Branches Are Short-Lived

**Work on any branch you want** (main, `claude/...`, feature branch, etc.).
The USER's rule: **always merge to main and delete the branch** when work is done.
- No long-lived feature branches — everything ends up on main quickly
- Main branch = source of truth
- User handles the merge + delete via GitHub web interface

### 2. Check Main FIRST

Before troubleshooting or building features:
1. Check if the feature already exists on main
2. Check if the "bug" is already fixed
3. Check if documentation already exists
4. Never assume something is missing without verifying

### 3. Explain WHY

For every technical decision:
- Explain the reasoning
- Document tradeoffs considered
- User needs to understand the "why"

### 4. GitHub Links + PC Commands

- Provide GitHub web links for PRs/branches
- User uses GitHub Desktop, not git CLI primarily
- Every PR needs: GitHub link, clear description, merge instructions

### 5. Always Merge & Delete (user's rule)

- When work is done, provide a PR link (GitHub web URL)
- USER always merges the PR into main and deletes the branch
- Never leave merged branches hanging around

### 6. Document Everything

Update CHANGELOG.md, FEATURES.md, README.md after every significant change.

---

## Git Operations

**For git push:**
- Always use: `git push -u origin <branch-name>`
- Retry up to 4 times with exponential backoff if network errors (2s, 4s, 8s, 16s)

**For git fetch/pull:**
- Prefer specific branches: `git fetch origin <branch-name>`
- Retry up to 4 times with exponential backoff if network failures

---

## Creating Commits

**Only commit when user explicitly asks.**

**Commit message format:**
```
Brief summary (50 chars or less)

Detailed explanation:
- What was changed
- Why it was changed
- Any side effects
```

---

## Security & Best Practices

- Never commit secrets (.env, credentials, API keys)
- Always check `git diff` before committing
- Use .gitignore appropriately

---

## When Things Go Wrong

**Uncertainty:** Ask the user before making big decisions. Provide options with pros/cons.

**Branch conflicts:** Check main first, verify unique work, report conflicts, ask user.

---

## Tech Stack

**Language:** TypeScript (JavaScript)
**Framework:** Next.js 14 (App Router), styled with Tailwind CSS 3
**Dependencies:** @clerk/nextjs (admin login), pg (PostgreSQL client), @react-pdf/renderer (PDF reports), recharts (dashboard charts), zod (input validation), canvas-confetti
**Build process:** `npm install` then `npm run build` (dev server: `npm run dev`, production server: `npm start`). The `dream-life-calculator/` folder has its own `package.json` and must be installed and built separately.
**Test command:** None — there is no test suite. `npm run lint` runs Next's ESLint.

---

## Deployment

**Environment:** Production intended; requires a PostgreSQL database
**Deployment method:** Needs investigation — ask user whether it is actually live. `DEPLOYMENT.md` documents three options (Vercel, recommended; Netlify; Railway), but the repo contains no `vercel.json`, `netlify.toml`, `Dockerfile`, or GitHub Actions workflow, so nothing is committed that pins a host. `.gitignore` does ignore a `.vercel` folder, which hints Vercel has been used at some point.
**URL:** Not recorded in the repo. The README links to https://tweakyourgeek.com as the parent brand site, and `.env.example` references `https://tweakyourgeek.com/dream-life-calculator`, but the calculator's own live URL is not written down. Ask the user.

---

## Project-Specific Rules

- **Environment variables (see `.env.example`):** `DATABASE_URL` (PostgreSQL, required for analytics), `NEXT_PUBLIC_ADMIN_PASSWORD`, optional email keys (`SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, or the Mailchimp trio), `NEXT_PUBLIC_BASE_URL`, and the three Tweak Your Geek link variables. Clerk uses `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- **Security flag — raise this with the user.** `.env.example` ships a default admin password of `admin123` under `NEXT_PUBLIC_ADMIN_PASSWORD`. Anything named `NEXT_PUBLIC_` is visible to anyone viewing the site in a browser, so this is not a real password. If `/admin` needs to be private, it should rely on the Clerk login in `middleware.ts` (and Clerk must actually be configured — the middleware currently lets everyone through when the Clerk key is missing).
- **Database tables are not created automatically.** Run `lib/db/schema.sql` against the PostgreSQL database first; see `DATABASE_SETUP.md`.
- **This repo holds two separate apps.** `dream-life-calculator/` is its own deployable Next.js app with its own dependencies. Installing or building at the repo root does NOT build it. Be explicit about which app you are changing.
- No real `.env` file is committed, and `.gitignore` correctly excludes `.env` and `.env*.local`. Keep it that way.
- Two remote branches are still unmerged: `claude/app-flow-international-2slGh` and `claude/deploy-lottery-app-PBLIq`. Check them before assuming work is missing.
- The tax figures in `lib/constants.ts` are real-world numbers that go stale. Confirm with the user before updating them.

---

## Common Tasks

```bash
npm install      # install dependencies (main app)
npm run dev      # start the local dev server at http://localhost:3000
npm run build    # production build
npm start        # run the production build locally
npm run lint     # run ESLint

cd dream-life-calculator && npm install && npm run dev   # the separate second app
```

---

**Remember:** Main branch = truth. Document everything. Explain why. Provide GitHub links.
