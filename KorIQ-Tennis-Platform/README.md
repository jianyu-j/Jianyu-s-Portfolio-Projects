# KorIQ — Tennis Performance & Club Management Platform

**[▶ Live demo](https://jianyu-j.github.io/Jianyu-s-Portfolio-Projects/KorIQ-Tennis-Platform/demo/)** — no install needed. Demo accounts are listed below.

> **Prototype / portfolio project.** A React application that models the full ecosystem of a tennis program: players, students, coaches, and clubs, tied together by a standardized NTRP-based evaluation system and a public community layer. The core slice — **authentication, clubs, coaches, students and the evaluation engine** — runs on a real **Supabase (Postgres) backend** with row-level security, database-side scoring and SQL analytics views. The surrounding features (bookings, payments, messaging, events, community feed) are still simulated with mock data in `localStorage`.

<!-- Add a hero screenshot or GIF here -->
<!-- ![KorIQ landing page](docs/screenshots/landing.png) -->

---

## Why I built this

Tennis coaching is mostly tracked in notebooks, spreadsheets, and text threads. Progress is subjective, clubs have little visibility into coach performance or revenue drivers, and players outside a club have no structured way to find partners, coaches, or courts.

KorIQ is my attempt to design what a single platform for that world would look like. The goal was less about shipping a production app and more about working through the **product and data-modelling problems**: how do you score a 2.5 player and a 4.5 player on the same scale? What does a club actually need to see to run a profitable program? How do club-only content and a public community coexist in one app?

---

## What it does

### Four role-based portals

| Role | Portal | Highlights |
|---|---|---|
| **Player** | `/player` | Home feed · Profile (NTRP, availability, preferred courts, self-assessment) · Match Up partner finder · Court Finder · Coach browsing & lesson booking · Tournaments · Messages · Connections · Streaks & badges · Purchased tutorials |
| **Student** | `/student` | Club-linked dashboard · My Progress (evaluation history, radar charts) · Physical tracking (sleep, hydration, cardio, strength, nutrition vs. age-based standards) · Club events · Ball Park feed |
| **Coach** | `/coach` | Two modes — *Independent* (students, tutorials, bookings, analytics, Free vs. Gold plan) and *Club coach* (assigned students, schedule, club events) · Add Evaluation flow · Per-student Progress / All Evaluations / Coach History / Feedback |
| **Club** | `/club` | Dashboard · Reports · Revenue (Analytics, Coach Invoices, Integrations) · Coaches · Students · Schedule · Events · Getting Started wizard · KorIQ Assistant chat widget · CSV payment import |

### Public community layer (`/community`)

Unauthenticated browsing of **Courts, Coaches, Clubs, Players, Ball Park (social feed), and Match Up (partner discovery + free/paid events)**, with role-gated sign-up and onboarding flows for each user type. Clubs control whether their content is visible to their members only (`club`) or to the wider community (`both`).

### NTRP-based evaluation engine

The core of the app. Every evaluation scores a student on two axes:

- **Fundamentals** — grip, setup, impact, swing, and recovery for each of the four strokes (forehand, backhand, serve, volley), each rated 1–10.
- **Performance criteria** — a level-specific checklist. A 1.0–1.5 player is assessed on *Ball Contact, Racket Control, Ball in Play*; a 4.5 player on *Pace Variation, Spin Variation, Court Coverage, Game Planning, First/Second Serve*.

The two axes are blended with **weights that shift by level** — fundamentals dominate for beginners (70/30) and performance dominates for advanced players (0/100) — producing a single 0–100 score that is comparable across the whole NTRP ladder. Strokes a coach didn't assess in a session are excluded rather than counted as zero; a session with no strokes assessed is scored on performance alone. On top of that, the app derives composite profiles, weakness detection, progression-over-time, peer averages, and promotion readiness.

### Backend: Supabase / Postgres

The evaluation slice is backed by a real database (`supabase/migrations/`), designed so the interesting logic lives in SQL rather than in the browser:

- **Schema** — `clubs`, `coaches`, `students`, `players`, `evaluations`, `profiles` (one auth user can hold several roles), and an `ntrp_levels` reference table that holds the per-level scoring weights.
- **Database-side scoring** — a `before insert` trigger computes fundamentals/performance averages and the weighted `final_score` from `ntrp_levels`, so every evaluation is scored the same way no matter which client wrote it. Evaluating a student at a higher level promotes them automatically.
- **Row-level security** — a student sees only their own evaluations; a coach sees what they authored plus their club's; a club sees everything inside its walls; only a coach can write an evaluation, only as themselves, only for a student they can see. Anonymous visitors can read the club directory and nothing else.
- **Sign-up RPCs** — `register_profile`, `claim_coach_profile`, `claim_student_profile` are `security definer` functions that validate the caller's JWT email before linking a pre-created roster row to a new account.
- **Analytics as SQL views** (`security_invoker`, so RLS still applies): `v_student_progress` (window functions: evaluation number, score delta, days since previous), `v_student_composite` (first → latest score, latest per-stroke scores, weakest stroke, promotion readiness, levels gained), `v_coach_impact` (evaluations, students, average improvement per coach), `v_club_monthly_evaluations`, and `v_level_benchmarks` (peer averages per NTRP band). The club portal's **Reports → Evaluation Analytics** panel renders these views directly.
- **Reproducible seed** — `scripts/generate-seed.mjs` derives `supabase/seed.sql` from the same `data/mockData/` that drives offline mode, including the demo accounts.

The front-end keeps a single synchronous data API (`services/storageService.ts`) with an in-memory cache hydrated from Postgres after login, so components are unaware of which backend is in use. Without Supabase env vars the app falls back to the original `localStorage` mock database.

### Club business intelligence

`utils/analyticsHelpers.ts` turns raw sessions, revenue, and expenses into the kind of metrics a club director actually asks for: student churn/engagement/LTV, coach revenue and retention impact, revenue by time-of-day/day-of-week/level, concentration risk, capacity opportunities, break-even analysis, simple forecasts, and auto-generated insights. All rendered with Recharts (radar, line, bar, area, pie, funnel).

### Other features

- **Booking system** — players request Private / Group / Evaluation lessons; coaches approve, decline, and review.
- **Tutorial marketplace** — coaches publish public or private paid video tutorials; players purchase and track them.
- **Match Up events** — free or paid community events with a simulated platform fee and "Apply to Host" flow.
- **Payment integrations (simulated)** — connection wizard for Stripe / Square / PayPal, sync status widget, and a Stripe sync service that turns payments into unclaimed student/coach profiles.
- **Coach invoicing** — line-item invoices with platform fee, including an "AI generate invoice" shortcut.
- **Gamification** — badges and streaks on player profiles.
- **Autosave** — debounced `localStorage` persistence with an idle / pending / saving / saved indicator (`useAutosave` hook).
- **Notifications & messaging** — in-app notification bell and threaded chat between players and coaches.
- **Mini-game** — a browser tennis game (`requestAnimationFrame`, real tennis scoring, three AI difficulties, four shot types) because every prototype needs one.

---

## Tech stack

- **React 19** + **TypeScript** + **Vite 6**
- **react-router-dom 7** (`HashRouter`, so it deploys anywhere static)
- **Recharts** for all data visualisation
- **Tailwind CSS** (CDN) with custom tennis/portal palette
- **lucide-react** icons
- PWA manifest (installable, standalone display)
- **Supabase** (Postgres, Auth, RLS, SQL views) via `@supabase/supabase-js` for the evaluation slice; `localStorage` mock database for everything else and for offline mode

### Project structure

```
App.tsx                 Root router, role switching, landing page
types.ts                Domain model (NTRP levels, evaluations, bookings, events, invoices, …)
components/
  Auth/                 Email/password auth modal (Supabase Auth, or mock users offline)
  Onboarding/           Per-role onboarding flows
  PlayerPortal/         Player tabs & widgets
  StudentPortal/        Student dashboard & progress
  CoachPortal/          Coach dashboard, evaluation entry, student views
  ClubPortal/           Club dashboard, BI panels, invoices, integrations, AI widget
  Community/            Public pages, nav, Ball Park, Match Up
  Charts/               Radar visualisation
  Shared/, ui/          Cross-portal components (booking form, badges, analytics, buttons)
  Game/                 Browser tennis mini-game
utils/
  calculations.ts       NTRP criteria, weighting, scoring, composite profiles
  analyticsHelpers.ts   Club/coach/student business metrics and insights
services/
  storageService.ts     Single data API: in-memory cache hydrated from Supabase, or localStorage offline
  authService.ts        Login / sign-up / claim flows for every role (Supabase Auth or mock users)
  remoteDataService.ts  Supabase queries, row ↔ domain-type mapping, analytics view readers
  supabaseClient.ts     Client factory; `isSupabaseEnabled` switch
supabase/
  migrations/           Schema, scoring trigger, RLS policies, sign-up RPCs, analytics views
  seed.sql              Generated demo dataset + demo auth users
scripts/generate-seed.mjs  Builds seed.sql from data/mockData
hooks/useAutosave.ts    Debounced autosave hook
data/mockData/          Seed data: users, clubs, coaches, students, programs, terms, sessions, revenue…
```

---

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build to dist/
npm run preview
```

`.env` points the app at the shared Supabase project (the anon key is public by design; access is enforced by row-level security). Leave both variables blank to run fully offline against the `localStorage` mock database.

To stand up your own database: create a Supabase project, disable **Confirm email** under Authentication → Providers → Email, then run `supabase/migrations/*.sql` followed by `supabase/seed.sql` in the SQL editor — or with the CLI, `supabase login` then `supabase db query --linked --project-ref <ref> -f <file>` for each. Regenerate the seed after editing mock data with `npm run db:seed:generate`.

The hosted demo is a static Vite build served by GitHub Pages from the `demo/` folder. To refresh it after changing the app, run `npm run build:demo` and commit the result.

### Demo accounts

All seeded accounts use the password `password`. Type the short username or the full email:

| Username | Email | Role |
|---|---|---|
| `player` | `player@koriq.demo` | Player |
| `student` | `student@koriq.demo` | Student (Olivia, club student) |
| `coach` | `coach@koriq.demo` | Coach Mike (club coach, Vancouver Tennis Club) |
| `coach2` | `coach2@koriq.demo` | Coach Sarah (club coach) |
| `club` | `club@koriq.demo` | Club admin, Vancouver Tennis Club |

Or sign up fresh to walk through one of the onboarding flows — new accounts are real Supabase users. Evaluations you submit as a coach are scored by the database and appear immediately in the student's progress view and the club's analytics.

---

## Scope and honest caveats

This is a prototype built to explore product design and data modelling, so the backend covers one vertical slice and the rest is intentionally simulated:

- **Real:** authentication and profiles, clubs, coaches, students, players, evaluations, and the evaluation analytics in the club Reports tab. These live in Postgres behind row-level security.
- **Simulated:** bookings, messaging, events, tutorials, ratings, revenue/expense records and the Stripe / Square / PayPal integrations are mock data persisted per-browser in `localStorage`.
- **KorIQ Assistant** is a rule-based, keyword-matched chat widget, not a live LLM.
- **Shared demo database** — everyone using the live demo writes to the same seeded dataset, so expect other visitors' evaluations to show up.
- **State management** is local React state with an in-memory cache; a production build would introduce a proper store and optimistic-update handling.

---

## What I'd do next

- Move the remaining collections (bookings, revenue, events) into Postgres now that the data layer is abstracted.
- Actual Stripe Connect integration for coach payouts and paid events.
- Replace the rule-based assistant with an LLM grounded in the club's own analytics (the SQL views are the natural grounding source).
- Test coverage for `calculations.ts` and `analyticsHelpers.ts`, and pgTAP tests for the RLS policies.

---
