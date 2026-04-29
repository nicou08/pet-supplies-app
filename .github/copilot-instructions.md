# Copilot Instructions

## Build, lint, and test commands

| Task | Command |
| --- | --- |
| Install dependencies | `npm install` |
| Generate Prisma client | `npx prisma generate` |
| Apply local Prisma migrations | `npx prisma migrate dev` |
| Start the dev server | `npm run dev` |
| Lint the repo | `npm run lint` |
| Build the app | `npm run build` |

There is currently no automated test runner configured in `package.json` or via repo-level test config files, so there is no full-suite or single-test command yet.

## High-level architecture

- This is a Next.js 15 App Router app. `app/layout.tsx` only sets global fonts, styles, and theme support. The shared storefront shell lives in `app/(root)/layout.tsx`, which wraps user-facing routes with `SessionProvider`, `CartProvider`, the main `Header`, and the floating `AIAssistant`. Auth pages live under `app/(auth)`.
- Most frontend data flow is: client component -> `hooks/use*.ts` SWR hook -> `app/api/*/route.ts` handler -> Prisma query via `@/lib/prismadb`. `lib/fetcher.ts` is the shared axios-based SWR fetcher.
- Auth is wired in `auth.ts` using NextAuth v5, the Prisma adapter, JWT sessions, and a custom sign-in page at `/sign-in`. `app/api/auth/[...nextauth]/route.ts` just re-exports the handlers from `auth.ts`.
- Route protection is mostly explicit in pages and handlers by calling `await auth()` and redirecting or returning `401`. `middleware.ts` exists, but there is no matcher config that centrally protects route groups.
- Checkout is the main exception to the API-route pattern: `components/header/checkout.tsx` calls the server action in `actions/stripe.ts` directly. That action re-reads products from Prisma, validates cart items, and creates the embedded Stripe Checkout session. `app/(root)/(routes)/return/page.tsx` completes the Stripe flow by retrieving the session from Stripe.
- The Prisma schema combines storefront, user, and services data: products, brands, product types, pet types, favourites, reviews, orders, appointments, and staff all live in `prisma/schema.prisma`.

## Key conventions

- Use `@/lib/prismadb` for database access. It creates Prisma through `@prisma/adapter-pg` and expects `DATABASE_URL_LOCAL`, not the default `DATABASE_URL`.
- Prefer extending the existing SWR hooks in `hooks/` instead of adding one-off client fetch logic. Pages and components already expect the hook layer to own API calls.
- Keep API response shapes stable. Several handlers explicitly map Prisma results into frontend-friendly DTOs and validate them with Zod schemas in `types/`.
- Product data has an important normalization step: the schema keeps both an optional primary `petTypeId` and a many-to-many `ProductPetType` relation, but product APIs flatten the junction rows into a `petTypes` array for consumers. Preserve that mapping when changing product queries or types.
- When changing auth-protected flows, check both the page component and the API route. This repo does not rely on a single centralized guard.
- Checkout changes should usually go through `actions/stripe.ts`, not a new checkout API route. The active checkout flow is server-action-based.

## Relevant MCP server

- If an MCP server is available for browser automation, prefer Playwright for validating user-facing changes. The highest-value flows in this repo are `/sign-in`, `/shop`, `/products/[productId]`, cart interactions from the header, `/checkout`, `/return`, `/services`, `/appointments`, and `/settings`.
