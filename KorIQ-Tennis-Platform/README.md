# KorIQ — Tennis Performance & Club Management Platform

**[▶ Live demo](https://jianyu-j.github.io/Jianyu-s-Portfolio-Projects/KorIQ-Tennis-Platform/demo/)** — no install needed. Demo accounts are listed below.

> **Prototype / portfolio project.** A front-end-only React application that models the full ecosystem of a tennis program: players, students, coaches, and clubs, tied together by a standardized NTRP-based evaluation system and a public community layer. All data is mock data persisted in `localStorage`; there is no backend.

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

The two axes are blended with **weights that shift by level** — fundamentals dominate for beginners (70/30) and performance dominates for advanced players (0/100) — producing a single 0–100 score that is comparable across the whole NTRP ladder. On top of that, the app derives composite profiles, weakness detection, progression-over-time, peer averages, and promotion readiness.

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
- No backend — `services/storageService.ts` is a `localStorage`-backed mock database seeded from `data/mockData/`

### Project structure

```
App.tsx                 Root router, role switching, landing page
types.ts                Domain model (NTRP levels, evaluations, bookings, events, invoices, …)
components/
  Auth/                 Mock email/password auth modal
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
services/               localStorage persistence, autosave, simulated Stripe sync
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

No API keys or environment variables are required.

The hosted demo is a static Vite build served by GitHub Pages from the `demo/` folder. To refresh it after changing the app, run `npm run build:demo` and commit the result.

### Demo accounts

All seeded accounts use the password `password`:

| Username | Role |
|---|---|
| `player` | Player |
| `student` | Student |
| `coach` | Coach (club) |
| `coach2` | Coach |
| `club` | Club admin |

Or sign up fresh to walk through one of the onboarding flows.

---

## Scope and honest caveats

This is a prototype built to explore product design and data modelling, so a few things are intentionally simulated:

- **Auth** is mock email/password against `localStorage`; there is no real session or security.
- **Payments** — the Stripe / Square / PayPal integrations and coach payouts are simulated end to end.
- **KorIQ Assistant** is a rule-based, keyword-matched chat widget, not a live LLM.
- **Persistence** is per-browser `localStorage`; clearing site data resets the app to seed data.
- **State management** is local React state; a production build would introduce a proper store and a backend.

---

## What I'd do next

- Real backend (Postgres + auth) and replace `storageService` with an API client.
- Server-side NTRP scoring so evaluations are auditable across coaches.
- Actual Stripe Connect integration for coach payouts and paid events.
- Replace the rule-based assistant with an LLM grounded in the club's own analytics.
- Test coverage for `calculations.ts` and `analyticsHelpers.ts`, which are the parts with real logic.

---
