# Codemaps

Task-oriented quick reference. Each row maps a common change to the file(s) to edit.

## Visual & UI

| Task | File(s) |
|------|---------|
| Change brand colors / palette | `apps/frontend/src/styles/theme.css` |
| Adjust border radius globally | `apps/frontend/src/styles/theme.css` → `--radius` |
| Swap to a shadcn palette preset | Copy `:root` + `.dark` blocks from https://ui.shadcn.com/themes into `theme.css` |
| Enable dark mode toggle | Add class toggle on `<html>` in `apps/frontend/src/App.tsx` |
| Change animation easing / durations | Search for `cubic-bezier` in `apps/frontend/src/pages/` and `components/catalog/` |
| Change skeleton shimmer speed | `apps/frontend/tailwind.config.ts` → `shimmer` keyframe / animation duration |
| Change grain texture intensity | `apps/frontend/src/index.css` → `body::after { opacity: ... }` |

## Navigation & Layout

| Task | File(s) |
|------|---------|
| Add / remove header nav links | `apps/frontend/src/components/layout/Header.tsx` |
| Add / remove sidebar nav links | `apps/frontend/src/components/layout/Sidebar.tsx` |
| Change footer content or links | `apps/frontend/src/components/layout/Footer.tsx` |
| Add a new page / route | Create `apps/frontend/src/pages/MyPage.tsx`, add `<Route>` in `apps/frontend/src/App.tsx` |

## Product Catalog

| Task | File(s) |
|------|---------|
| Change which products are featured (global) | `apps/backend/prisma/seed.ts` → `pnpm seed`, or `PUT /api/products/featured` (see CODEBASE-STRUCTURE.md) |
| Change which products are featured (per category) | Same as above with `scope` set to the category string (e.g. `"electronics"`) |
| Change the number of products shown on the home page | `apps/frontend/src/pages/HomePage.tsx` → `visible` slice / `PAGE_SIZE` constant |
| Change sort options available in the filter bar | `apps/frontend/src/components/catalog/SortFilterBar.tsx` |
| Change how product cards look | `apps/frontend/src/components/catalog/ProductCard.tsx` |
| Change the featured product carousel | `apps/frontend/src/components/catalog/ProductCarousel.tsx` |
| Change the related products section | `apps/frontend/src/components/catalog/RelatedProducts.tsx` |

## Search

| Task | File(s) |
|------|---------|
| Change search suggestion behavior / appearance | `apps/frontend/src/components/catalog/SearchSuggestions.tsx` |
| Change backend search logic | `apps/backend/src/modules/catalog/catalog.service.ts` → `search()` |
| Change search query validation | `apps/backend/src/modules/catalog/catalog.schemas.ts` → `searchQuerySchema` |

## Enquiry / Email

| Task | File(s) |
|------|---------|
| Change the enquiry form fields | `apps/frontend/src/components/catalog/EnquiryModal.tsx` + `apps/backend/src/modules/enquiry/enquiry.schemas.ts` |
| Change the enquiry email template | `apps/backend/src/modules/enquiry/enquiry.smtp.ts` |
| Configure real SMTP sending | `apps/backend/.env` → set all `SMTP_*` vars |
| View dev-mode enquiry submissions | `.dev-mail/*.json` (gitignored, written when SMTP is not configured) |

## Backend

| Task | File(s) |
|------|---------|
| Add a new API endpoint | Create or edit `apps/backend/src/modules/<domain>/*.routes.ts`, register in `apps/backend/src/app.ts` |
| Add a new database table | `apps/backend/prisma/schema.prisma` → `pnpm prisma:migrate` |
| Change request validation rules | `apps/backend/src/modules/<domain>/*.schemas.ts` |
| Change business logic | `apps/backend/src/modules/<domain>/*.service.ts` |
| Swap the product data source (away from Fake Store API) | Implement `ProductProvider` interface, wire in `apps/backend/src/server.ts` |
| Swap the mail adapter | Implement `MailPort` interface, wire in `apps/backend/src/server.ts` |

## SEO

| Task | File(s) |
|------|---------|
| Change per-page title / description / OG tags | `apps/frontend/src/hooks/use-seo.ts` (default values) or each page's `useSeo()` call |
| Update the sitemap | `apps/frontend/public/sitemap.xml` |
| Update the base URL for production SEO | `apps/frontend/src/hooks/use-seo.ts` → `BASE_URL` constant + `apps/frontend/public/sitemap.xml` |

## Testing

| Task | File(s) |
|------|---------|
| Add / edit backend unit or integration tests | `apps/backend/src/modules/<domain>/*.test.ts` |
| Add / edit E2E tests | `e2e/catalog.spec.ts` |
| Run all tests | `pnpm test` (unit + integration) · `pnpm test:e2e` (Playwright) |
