# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start local dev server (localhost:3000)
npm run dev:docker   # Start dev server bound for Docker container access
npm run build        # Production build
npm run lint         # ESLint (max-warnings=0 — treat warnings as errors)
npm run db:seed      # Seed the database with sample storefront data
npm run db:seed-sales # Insert sample sales and link them to products
npm run db:dump-seed # Export current DB rows back into seed data
```

**Tests:** Playwright (`@playwright/test`) is installed but no test script or test files exist yet. No `npm test` command is configured.

**Docker:**
```bash
docker compose up    # Start app in container (rewrites DB host to host.docker.internal)
```

## Environment Variables

All variables live in a single `.env` file (there is no `.env.local`):
```
DATABASE_URL_LOCAL=          # PostgreSQL connection string — see DB note below
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=             # Base URL of the app, e.g. http://localhost:3000
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

**Database:** `DATABASE_URL_LOCAL` (read in `lib/prismadb.ts`) points at the Docker
Postgres instance on **port 5434** — that is the real/active database. Multiple local
Postgres instances exist on this machine; only 5434 is the one the app uses.

## Architecture

**Stack:** Next.js 15 App Router, React 19, TypeScript, Prisma 7 (PrismaPg adapter) + PostgreSQL, better-auth, Stripe Embedded Checkout, Radix UI + Tailwind CSS, SWR + Axios.

### Request Flow

```
Client component
  → hooks/use*.ts  (SWR wrapping Axios via lib/fetcher.ts)
  → app/api/*      (Next.js route handlers)
  → lib/prismadb   (singleton Prisma client)
  → PostgreSQL
```

The single exception is **Stripe checkout**, which uses a server action (`actions/stripe.ts`) called directly from the client rather than an API route.

### Directory Layout

| Path | Purpose |
|---|---|
| `app/(root)/` | Main shell — wraps all user-facing pages with `CartProvider`, persistent `Header`, and `AIAssistant` |
| `app/(root)/(routes)/` | User routes: home, `/shop` (+ `(shop)/Food`, `(shop)/Toys` category pages), `/products/[productId]`, `/pets` + `/pets/[pet]`, `/sales`, `/new-arrivals`, `/services`, `/appointments`, `/checkout`, `/return`, `/settings` |
| `app/(auth)/` | Auth pages (`/sign-in`) |
| `app/api/` | REST-style route handlers: `products` (+ `[productId]`, `[productId]/recommendations`), `search`, `reviews`, `favourites`, `appointments`, `staff` (+ `[id]/availability`), `pet-types`, `product-types`, `auth`. There is **no** `checkout_sessions` route — checkout is a Stripe server action (see below). |
| `actions/` | Server actions (currently only Stripe checkout) |
| `components/` | Shared UI components; `header/` contains the Cart/Checkout flow |
| `context/CartContext.tsx` | Global cart state via React Context |
| `hooks/` | SWR-based data-fetching hooks (`useProducts`, `useReviews`, etc.) |
| `lib/prismadb.ts` | Singleton Prisma client — **all DB access goes through here** |
| `lib/fetcher.ts` | Axios-based SWR fetcher shared by all hooks |
| `lib/pricing.ts` | **Single source of truth for all sale/discount math** (client- and server-safe) |
| `lib/slots.ts`, `lib/availability.ts` | Appointment slot generation and staff availability logic |
| `types/` | Zod schemas + TypeScript types used for API response validation |
| `prisma/` | Schema, `seed.ts`, `seed-sales.ts`, `dump-seed.ts` |

### Key Patterns

**Data access:** Every DB query uses the singleton from `lib/prismadb.ts`. API handlers map Prisma results to Zod-validated shapes before returning — always match the existing DTO pattern in nearby route files.

**Product normalization:** Products have an optional `petTypeId` FK plus a `ProductPetType` many-to-many junction. API responses flatten these into a single `petTypes` array — preserve this shape when touching product routes.

**Sales & pricing:** Sales are modeled by the `Sale` and `ProductSale` (junction) tables plus a `SaleType` enum (`PERCENTAGE`, `BUY_X_GET_Y`); `Product` also carries `isOnSale`/`isClearance`/`isNewArrival` boolean flags. **All discount math must go through `lib/pricing.ts`** — it's plain, client-safe TypeScript (no server-only imports) so cart totals, product cards, API routes, and the Stripe charge all compute identically. Never duplicate the math elsewhere. Use `resolveActiveSale` to pick the applicable sale (respects `active` + date window, one sale per product) and `computeLinePrice` for totals. Sales are inserted manually via `npm run db:seed-sales`.

**Appointment scheduling:** Staff availability comes from `StaffSchedule` (recurring weekly hours, one row per weekday) and `StaffTimeOff` (date-range exceptions). Appointments are fixed 30-minute slots keyed by a canonical `"HH:mm"` 24-hour `appointmentTime` string. Slot generation and free/busy resolution live in `lib/slots.ts` and `lib/availability.ts` (surfaced via `api/staff/[id]/availability`) — route new scheduling logic through those helpers rather than recomputing slots inline.

**Auth guards:** Protected pages/handlers use better-auth session validation. `middleware.ts` exists but has no `matcher` configured, so it does not centrally protect routes.

**Adding data-fetching:** Extend or add a hook in `hooks/` using SWR + `lib/fetcher.ts`. Don't add one-off `fetch`/`axios` calls inline in components.

**Commit conventions:** Follow the AI-assisted workflow in `AI_WORKFLOW.md` — conventional commits (`feat:`, `fix:`, `docs:`, etc.) are expected.

## Git Workflow

New feature work is done on a dedicated `feat/*` branch (e.g. `feat/carousel-links`), one branch per feature, kept off `main` until reviewed.

**These rules are mandatory — do not deviate without an explicit instruction:**

1. **Never commit automatically.** After implementing a feature, stop and let the user review and manually test it first. Present the change and wait — the user decides when it's ready to commit (or explicitly tells you to commit).
2. **Never merge a feature branch on your own.** Even once changes are committed, do **not** merge a `feat/*` branch into `main`. Always ask the user first and wait for confirmation.

In short: implement freely on the branch, but **ask before committing and ask before merging.**

## Task Tracking

Pending and completed work is tracked in `TODO.md` at the project root. Check it at the start of each session to understand current priorities.
