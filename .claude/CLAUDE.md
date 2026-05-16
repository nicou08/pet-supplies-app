# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start local dev server (localhost:3000)
npm run dev:docker   # Start dev server bound for Docker container access
npm run build        # Production build
npm run lint         # ESLint (max-warnings=0 — treat warnings as errors)
npm run db:seed      # Seed the database with sample storefront data
```

**Tests:** Playwright (`@playwright/test`) is installed but no test script or test files exist yet. No `npm test` command is configured.

**Docker:**
```bash
docker compose up    # Start app in container (rewrites DB host to host.docker.internal)
```

## Environment Variables

Required in `.env.local`:
```
DATABASE_URL_LOCAL=          # PostgreSQL connection string
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=             # Base URL of the app, e.g. http://localhost:3000
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXT_PUBLIC_APP_URL=         # Optional — app origin fallback
```

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
| `app/(root)/(routes)/` | User routes: `/shop`, `/products/[id]`, `/checkout`, `/appointments`, `/return`, etc. |
| `app/(auth)/` | Auth pages (`/sign-in`) |
| `app/api/` | REST-style route handlers: `products`, `search`, `reviews`, `favourites`, `appointments`, `staff`, `checkout_sessions`, `auth` |
| `actions/` | Server actions (currently only Stripe checkout) |
| `components/` | Shared UI components; `header/` contains the Cart/Checkout flow |
| `context/CartContext.tsx` | Global cart state via React Context |
| `hooks/` | SWR-based data-fetching hooks (`useProducts`, `useReviews`, etc.) |
| `lib/prismadb.ts` | Singleton Prisma client — **all DB access goes through here** |
| `lib/fetcher.ts` | Axios-based SWR fetcher shared by all hooks |
| `types/` | Zod schemas + TypeScript types used for API response validation |
| `prisma/` | Schema and `seed.ts` |

### Key Patterns

**Data access:** Every DB query uses the singleton from `lib/prismadb.ts`. API handlers map Prisma results to Zod-validated shapes before returning — always match the existing DTO pattern in nearby route files.

**Product normalization:** Products have an optional `petTypeId` FK plus a `ProductPetType` many-to-many junction. API responses flatten these into a single `petTypes` array — preserve this shape when touching product routes.

**Auth guards:** Protected pages/handlers use better-auth session validation. `middleware.ts` exists but has no `matcher` configured, so it does not centrally protect routes.

**Adding data-fetching:** Extend or add a hook in `hooks/` using SWR + `lib/fetcher.ts`. Don't add one-off `fetch`/`axios` calls inline in components.

**Commit conventions:** Follow the AI-assisted workflow in `AI_WORKFLOW.md` — conventional commits (`feat:`, `fix:`, `docs:`, etc.) are expected.

## Task Tracking

Pending and completed work is tracked in `TODO.md` at the project root. Check it at the start of each session to understand current priorities.
