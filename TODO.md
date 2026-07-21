# TODO

Pending tasks for the pet-supplies-app. Check this file at the start of sessions to understand what work is in progress or planned.

## Done

- [x] Fix all of the navigation — header, homepage, individual pages, etc.
- [x] Complete `pets/[pet_id]` page design
- [x] Create proper logo
- [x] Properly implement light and dark mode
- [x] Add a badge to the cart icon showing item count
- [x] Complete `product/[product_id]` page design
- [x] Fix appointment service
- [x] Create sign-in page
- [x] Add a settings page
- [x] Create footer
- [x] Implement sale functionality (Sale/ProductSale tables, PERCENTAGE & BUY_X_GET_Y; pricing in `lib/pricing.ts`; insert sales via `npm run db:seed-sales`)
- [x] Create a dedicated `/sales` page listing on-sale products

## Backlog

Ordered to build foundational data first, then the pages, then the navigation that links to them, then polish and standalone features.

1. [ ] Add more products, probably like 100 more — foundational seed data; makes new-arrivals, sales, and search meaningful
2. [x] Create a new-arrivals page — needs product data with dates from step 1
3. [ ] Add new arrivals and sales buttons to header — links to the new-arrivals page (step 2) and the existing `/sales` page
4. [ ] Add carousel proper redirect links — wire homepage carousel to the now-existing category/sales/new-arrivals destinations
5. [ ] Fix homepage appointments row design — UI polish, independent
6. [ ] Implement Google and Email sign-in — extends auth ahead of the signed-in-only homepage row
7. [ ] Add a favourites row on the homepage (signed-in users only) — relies on solid auth from step 6
8. [ ] Implement Chatbot helper — largest standalone feature; best done last
