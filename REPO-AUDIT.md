# REPO-AUDIT.md — lotto-site

**Audit Date:** 2026-03-14
**Audited By:** Claude Code (Opus 4.6)

---

## Repo Overview

- **Git Remote URL:** `https://github.com/tweakyourgeek/lotto-site`
- **GitHub Account:** tweakyourgeek
- **Repo Name:** lotto-site
- **Full URL:** https://github.com/tweakyourgeek/lotto-site

### Deployable Apps

This repo contains **2 distinct deployable apps**:

| # | App Name | Subdirectory Path | Description |
|---|----------|--------------------|-------------|
| 1 | Lottery Reality Check | `/` (root) | Lottery jackpot calculator wizard with analytics dashboard |
| 2 | Dream Life Calculator | `/dream-life-calculator/` | Standalone cost-of-living calculator |

### Tech Stack Per App

**App 1 — Lottery Reality Check (root)**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Database:** PostgreSQL (via `pg` driver)
- **Auth:** Clerk (`@clerk/nextjs` v6.36.3) — optional, for admin route protection
- **Email:** Mailerlite (active), SendGrid/Mailchimp (documented alternatives)
- **PDF:** `@react-pdf/renderer` + HTML-based generation
- **Validation:** Zod
- **Other:** canvas-confetti, uuid

**App 2 — Dream Life Calculator (`/dream-life-calculator/`)**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Dependencies:** Next.js, React, React DOM only — no database, no auth, no email

### Vercel Connection

- **vercel.json:** Not present
- **.vercel directory:** Not present
- No Vercel-specific configuration files found
- The app is Vercel-ready by default (standard Next.js 14)
- Multiple Vercel projects: Unknown — no evidence of multiple project configurations

---

## Repo Classification

- **📦 MULTI-APP REPO:** Contains 2 distinct deployable Next.js apps
- **🚀 APP REPO:** Both apps are deployable web applications

---

## Non-App Content Inventory

### Non-App Files

| File/Directory | Type | Purpose |
|----------------|------|---------|
| `DATABASE_SETUP.md` | Documentation | Comprehensive PostgreSQL setup, schema docs, maintenance, scaling guide (390 lines) |
| `DEPLOYMENT.md` | Documentation | Multi-platform deployment guide (548 lines) |
| `README.md` | Documentation | Full project overview, features, customization guide (370 lines) |
| `lib/db/schema.sql` | Database schema | PostgreSQL table and view definitions (118 lines) |

### Assessment

- All non-app content is **directly relevant** to the main application
- Documentation is comprehensive and well-written
- The `schema.sql` file is essential for database setup
- No orphaned data files, extracted conversations, or junk content

### Recommendation

**Keep** — all non-app content is useful project documentation.

---

## Documentation Suite

- ✅ **README.md** — Substantive, 370 lines. Comprehensive overview including features, tech stack, project structure, brand identity, deployment options, accessibility, roadmap, and troubleshooting.
- ❌ **CLAUDE.md** — missing
- ❌ **.claudeignore** — missing
- ✅ **.gitignore** — Appropriate for the stack. Covers node_modules, .next, .env files, Vercel config, dream-life-calculator build artifacts, TypeScript build info.
- ❌ **LICENSE** — missing (README states "Proprietary - All rights reserved by Tweak Your Geek" but no LICENSE file exists)
- ❌ **CHANGELOG.md** — missing
- ❌ **CONTRIBUTING.md** — missing (README says "This is a proprietary project for Tweak Your Geek. For issues or suggestions, contact the development team.")
- ✅ **package.json** — Present
  - `"name"`: `"lottery-reality-check"`
  - `"description"`: not set
  - `"scripts"`: `dev`, `build`, `start`, `lint`
- ✅ **tsconfig.json** — Present (standard Next.js TypeScript config)
- ✅ **.env.example** — Present. Documents DATABASE_URL, NEXT_PUBLIC_ADMIN_PASSWORD, SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, MAILCHIMP_AUDIENCE_ID, BROWSERLESS_API_KEY, NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_DREAM_LIFE_CALCULATOR_URL, NEXT_PUBLIC_NO_SPEND_JOURNAL_URL, NEXT_PUBLIC_COMMUNITY_URL
- ❌ **Tests** — No test files, no test directories, no testing framework configured. No Jest, Vitest, Playwright, or Cypress.
- ❌ **CI/CD** — No `.github/workflows/`, no Vercel config, no Netlify config, no CI/CD automation of any kind.
- ✅ **Other docs:**
  - `DEPLOYMENT.md` — Comprehensive multi-platform deployment guide
  - `DATABASE_SETUP.md` — Detailed database setup, schema, maintenance, security, scaling guide

**Doc Suite Score: 5 out of 12**

---

## Per-App Deep Dive

### App 1: Lottery Reality Check

**Path:** `/` (root)
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, PostgreSQL, Clerk, Recharts

#### Authentication

- **Yes — Clerk** (`@clerk/nextjs` v6.36.3)
- Clerk is used to protect the `/admin` route via middleware
- Gracefully degrades if `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is not set — falls back to basic password protection (`NEXT_PUBLIC_ADMIN_PASSWORD`)
- Admin page dynamically imports Clerk components: `SignedIn`, `SignedOut`, `SignInButton`, `UserButton`
- Auth-related environment variables:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY` (documented in .env.example pattern)

#### Database

- **Yes — PostgreSQL** via `pg` (node-postgres) driver v8.11.3
- Connection managed in `lib/db/index.ts` with connection pooling (max 20 connections)
- Schema defined in `lib/db/schema.sql`
- **Tables:** `sessions`, `debt_selections`, `lifestyle_selections`, `email_captures`
- **Views:** `analytics_summary`, `popular_debts`, `popular_lifestyle`, `state_distribution`, `daily_stats`
- No ORM — raw SQL queries via `pg` Pool
- Database-related environment variable: `DATABASE_URL`

#### API Routes / Server-Side Logic

- **Yes — 6 API routes:**
  - `POST /api/analytics` — Creates/updates session analytics data
  - `POST /api/email` — Email capture, sends to Mailerlite
  - `GET /api/pdf` — Generates PDF report (returns HTML)
  - `GET /api/admin/analytics` — Admin analytics summary
  - `GET /api/admin/debts` — Popular debt categories
  - `GET /api/admin/lifestyle` — Popular lifestyle categories
  - `GET /api/admin/states` — State distribution data
  - `GET /api/admin/daily` — Daily stats
- **SSR:** The app uses Next.js App Router with both client and server components. API routes run server-side. The main page is a client component (`'use client'`).
- **Serverless functions:** All API routes function as serverless when deployed to Vercel
- **Custom APIs:** All API routes are self-built, not third-party

#### Payments

- **No** — No Stripe, PayPal, LemonSqueezy, or any payment processor
- No webhook endpoints for payments

#### Email / Notifications

- **Yes — Mailerlite** (active implementation in `app/api/email/route.ts`)
  - Endpoint: `https://connect.mailerlite.com/api/subscribers`
  - Adds subscribers with optional group assignment
  - Gracefully handles missing API key (logs warning, continues)
- **SendGrid** — documented in README/.env.example but NOT actively implemented in code
- **Mailchimp** — documented in README/.env.example but NOT actively implemented in code
- No push notifications or other notification systems

#### Hosting Other People's Content

- **Partial** — The app stores email addresses (opt-in only) and anonymous session data in PostgreSQL
- Email addresses are user-submitted and stored on the app's infrastructure
- No file upload features
- No user-generated content beyond email addresses and calculator selections

#### Environment Variables

All environment variables referenced in the codebase:

| Variable | Source | Status |
|----------|--------|--------|
| `DATABASE_URL` | `lib/db/index.ts` | Required for analytics |
| `NODE_ENV` | `lib/db/index.ts` | Auto-set by runtime |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `middleware.ts`, `app/layout.tsx`, `app/admin/page.tsx` | Optional (Clerk auth) |
| `CLERK_SECRET_KEY` | Clerk middleware (implicit) | Optional (Clerk auth) |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | `app/admin/page.tsx` | Required (fallback admin auth) |
| `MAILERLITE_API_KEY` | `app/api/email/route.ts` | Optional (email capture) |
| `MAILERLITE_GROUP_ID` | `app/api/email/route.ts` | Optional (email segmentation) |
| `NEXT_PUBLIC_BASE_URL` | PDF/email templates | Optional |
| `NEXT_PUBLIC_DREAM_LIFE_CALCULATOR_URL` | PDF/email templates | Optional |
| `NEXT_PUBLIC_NO_SPEND_JOURNAL_URL` | PDF/email templates | Optional |
| `NEXT_PUBLIC_COMMUNITY_URL` | PDF/email templates | Optional |
| `SENDGRID_API_KEY` | `.env.example` only | Documented, not active |
| `SENDGRID_FROM_EMAIL` | `.env.example` only | Documented, not active |
| `MAILCHIMP_API_KEY` | `.env.example` only | Documented, not active |
| `MAILCHIMP_SERVER_PREFIX` | `.env.example` only | Documented, not active |
| `MAILCHIMP_AUDIENCE_ID` | `.env.example` only | Documented, not active |
| `BROWSERLESS_API_KEY` | `.env.example` only | Documented, not active |
| `NEXT_PUBLIC_GA_ID` | `.env.example` only | Documented, not active |

#### Verdict

**🔴 NEEDS A SERVER**

This app requires a server runtime. It has:
- PostgreSQL database connections
- Server-side API routes (analytics, email, PDF, admin)
- Clerk authentication middleware
- Mailerlite API integration
- Cannot run on GitHub Pages

---

### App 2: Dream Life Calculator

**Path:** `/dream-life-calculator/`
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS

#### Authentication

- **No** — No authentication of any kind

#### Database

- **No** — No database connection, no database dependencies

#### API Routes / Server-Side Logic

- **No** — No API routes, no server-side logic
- Pure client-side calculator
- All state managed in React `useState`

#### Payments

- **No** — No payment processing

#### Email / Notifications

- **No** — No email integration

#### Hosting Other People's Content

- **No** — No user content storage, no file uploads

#### Environment Variables

- **None** — No environment variables referenced in the dream-life-calculator codebase

#### Verdict

**🟢 STATIC**

This app is a pure client-side calculator with:
- No database
- No API routes
- No authentication
- No environment variables
- Only dependencies: Next.js, React, React DOM, Tailwind CSS
- Can be statically exported and hosted on GitHub Pages

---
