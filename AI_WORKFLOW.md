# AI-Assisted Development Workflow

This guide is for developing this project primarily with GitHub Copilot and agent support.

## Why This File Is In Root

- Keep this in the repository root so it is versioned and visible to everyone.
- Do not place workflow docs in `.next/` because `.next/` is generated build output.

## 1) Commit Rhythm

Use small, focused commits.

- One task per commit.
- Aim for a commit every 10-60 minutes of meaningful progress.
- Do not mix refactors, features, and bug fixes in one commit.
- Commit only after the validation checklist passes.

Commit message pattern:

```text
<type>: <short outcome>
```

Examples:

- `feat: add pet type filter chips to products page`
- `fix: handle empty appointment slots in schedule API`
- `refactor: split cart total logic into utility function`

## 2) Prompt Patterns

Use this template when asking Copilot or agents for code changes.

```text
Context:
- Next.js App Router project with TypeScript and Prisma.
- Files likely involved: <paths>

Objective:
- <what to implement>

Constraints:
- Keep existing API response shape.
- Do not change auth flow unless requested.
- Preserve current UI patterns/components.

Validation:
- Run lint and build.
- Manually test: <specific flow>
```

Good prompt examples:

- "Add pagination to products list using query params `page` and `limit`, keep current response shape, and update UI controls in the products route."
- "Fix duplicate cart item merge behavior without changing cart context API."

## 3) Validation Steps

Run these checks for each completed task.

1. `npm run lint`
2. `npm run build`
3. Manual smoke test of the changed user flow

Suggested manual checks:

- Auth flow (sign in/sign out still works)
- Product browsing and search
- Cart add/remove/update quantity
- Checkout session creation path

## 4) Session Workflow

Use this lightweight cycle for each task:

1. Define a single small task.
2. Ask Copilot/Agent with the prompt pattern.
3. Review generated diff before accepting.
4. Run validation steps.
5. Commit with a focused message.

## 5) Safety Rules

- Never accept generated code blindly.
- Ask for explanations when a change is non-trivial.
- Prefer incremental edits over large rewrites.
- Keep database schema and API contracts explicit.

## 6) Branch Policy For AI Work

- Do each new feature on its own `feat/*` branch (e.g. `feat/carousel-links`).
- Keep `main` stable.
- Do not commit until the user has reviewed and manually tested the change.
- Do not merge a `feat/*` branch into `main` without asking the user first.
