# Pet Supplies App

A full-stack pet e-commerce and pet services application built with Next.js.

The goal of this project is to provide an online experience where users can browse pet products, manage a cart, checkout with Stripe, and access pet-related service flows (such as appointments).

## Current Status

This repository is an active work in progress.

- Core storefront, API routes, and data models are present.
- Stripe and authentication integration are wired in the codebase.
- The app is being continued on an AI-assisted branch and workflow.
- Production AWS deployment is a target, not the current state.

## Core Features

- Product catalog and pet-focused browsing
- Product type and pet type filtering
- Search API and search-driven pages
- Cart and checkout flow with Stripe Embedded Checkout
- User auth via NextAuth
- Reviews and favorites
- Appointment and staff service domain models

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Prisma ORM + PostgreSQL
- NextAuth (Auth.js)
- Stripe (server + client SDKs)
- Tailwind CSS + Radix UI components
- SWR for client data fetching patterns

## Repository Layout

- `app/` - App Router pages, layouts, and route handlers
- `app/api/` - API route handlers (products, search, appointments, checkout, etc.)
- `components/` - UI and feature components
- `actions/` - server actions (for example Stripe checkout session work)
- `context/` - app state providers (cart, etc.)
- `hooks/` - reusable frontend data hooks
- `lib/` - shared integrations/utilities (Prisma, Stripe, fetch helpers)
- `prisma/` - schema and migrations
- `types/` - shared TypeScript types

## Getting Started

### 1. Prerequisites

- Node.js 18+
- npm 9+
- A PostgreSQL database

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local env file (for example `.env.local`) and set the variables your local run needs.

Variables referenced in code:

- `DATABASE_URL_LOCAL` (Prisma PostgreSQL connection string)
- `STRIPE_SECRET_KEY` (server-side Stripe key)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (client-side Stripe key)
- `NEXT_PUBLIC_APP_URL` (optional app origin fallback, example `http://localhost:3000`)

Auth provider variables are also required for GitHub OAuth (names depend on your Auth.js/NextAuth setup conventions).

### 4. Prepare Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## NPM Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint project

## Route Overview

Main app route groups live in `app/(root)/(routes)/`.

Examples of user-facing routes:

- `/shop`
- `/products`
- `/pets`
- `/services`
- `/appointments`
- `/checkout`
- `/settings`
- `/return`

Auth-related pages are grouped under `app/(auth)/`.

## API Overview

API handlers are under `app/api/`.

- `/api/products`
- `/api/product-types`
- `/api/pet-types`
- `/api/search`
- `/api/reviews`
- `/api/favourites`
- `/api/appointments`
- `/api/staff`
- `/api/checkout_sessions`
- `/api/auth`

## Data Model Summary

The Prisma schema includes:

- Commerce: `Product`, `ProductType`, `Brand`, `Order`, `OrderItem`
- Pet domain: `PetType` and product-to-pet associations
- User features: `User`, `Review`, `Favourite`, `Account`
- Services: `Appointment`, `Staff`

## Quality Checks

Before committing changes:

```bash
npm run lint
npm run build
```

Also manually test the changed flow (for example auth, cart, checkout, search, or appointments).

## Deployment Target (Planned)

Target platform: AWS.

Planned production direction:

- Host Next.js app in AWS-friendly runtime
- Managed PostgreSQL for Prisma
- Secure secret management for auth/payment keys
- CI/CD pipeline for build, test, and deployment
- Monitoring, logs, and rollback strategy

This README will be updated as the production architecture is finalized.

## AI-Assisted Development

This repository includes an AI workflow guide for day-to-day development:

- See `AI_WORKFLOW.md`
