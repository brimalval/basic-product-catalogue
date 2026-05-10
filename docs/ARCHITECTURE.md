# Architecture

## Overview

A pnpm monorepo with two workspaces:

```
apps/
  backend/    Node.js HTTP server (native http module)
  frontend/   React + Vite SPA
```

The frontend communicates exclusively with the backend. The backend proxies requests to Fake Store API — the frontend never calls the external API directly.

## Backend

### Module structure

```
src/
  modules/
    catalog/       Product catalog domain
    enquiry/       Customer enquiry domain
    health/        Health check endpoint
  shared/
    db/            Prisma client singleton
    http/          Router, helpers, middleware
  app.ts           createApp() factory
  server.ts        Composition root + server startup
```

Each module contains:
- `*.types.ts` — domain interfaces (the contract)
- `*.repository.ts` — data access (Prisma implementation)
- `*.service.ts` — business logic
- `*.routes.ts` — HTTP binding
- `*.schemas.ts` — Zod validation schemas
- `*.test.ts` — tests

### Key patterns

**Ports and adapters.** External dependencies sit behind interfaces:
- `ProductProvider` — implemented by `fakeStoreAdapter` (Fake Store API with 5s timeout)
- `MailPort` — implemented by `devMailAdapter` (writes JSON to `.dev-mail/`)
- `IFeaturedRepository` / `IEnquiryRepository` — implemented by Prisma repositories

**Dependency injection via constructor.** No DI framework. `server.ts` wires everything:

```ts
const catalogService = new CatalogService(fakeStoreAdapter, new PrismaFeaturedRepository(db))
const enquiryService = new EnquiryService(new PrismaEnquiryRepository(db), devMailAdapter)
```

**Tiny router.** ~50-line `Router` class (no Express/Fastify). Named path params, ordered route matching, async handlers.

### HTTP endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Liveness probe |
| GET | /api/products | All products (supports `?q=` search) |
| GET | /api/products/featured | Featured products (supports `?scope=`) |
| GET | /api/products/:id | Single product |
| GET | /api/categories | All categories |
| GET | /api/categories/:category/products | Products by category |
| POST | /api/enquiries | Submit customer enquiry |

### Database

SQLite via Prisma. Two tables:

- `FeaturedProductPreference(id, scope, productId, rank)` — curated product ordering per scope (global, per-category). Pre-seeded.
- `Enquiry(id, productId, productTitle, name, email, phone?, message, createdAt)` — customer enquiry records.

## Frontend

```
src/
  lib/
    types.ts     Shared TypeScript interfaces
    api.ts       Typed fetch wrapper for all /api/* endpoints
    utils.ts     cn() utility (clsx + tailwind-merge)
  hooks/
    use-catalog.ts   TanStack Query hooks (products, categories, search, featured)
    use-enquiry.ts   Mutation hook for enquiry submission
  components/
    ui/          shadcn/ui primitives (Button, Card, Input, etc.)
    layout/      Header (nav + search)
    catalog/     ProductCard
  pages/
    HomePage.tsx           Featured products grid
    CatalogPage.tsx        All products / search results
    ProductDetailPage.tsx  Product detail + enquiry form
  App.tsx        Route definitions
  main.tsx       React root, QueryClient, BrowserRouter
```

### Data flow

1. User navigates to a page → React Router renders the matching page component.
2. Page component calls a TanStack Query hook → hook calls `api.ts` → Vite dev proxy forwards to backend.
3. Backend fetches from Fake Store API (or SQLite), returns JSON.
4. TanStack Query caches the response (staleTime: 30s). Skeleton UI shown during loading.
5. For enquiries: `react-hook-form` validates locally with Zod → submits via `useEnquiry` mutation → backend validates again with Zod, persists, triggers mail adapter.

## Extracting a module to a microservice

Each module is designed to be independently extractable:

1. The module's `*.types.ts` defines the public contract (interfaces only).
2. Move the module directory to a new service repository.
3. Replace the `ProductProvider` / `MailPort` / repository with HTTP adapters that call the new service.
4. The composition root (`server.ts`) is the only file that changes in the remaining monolith.

No circular dependencies exist between modules. Shared utilities (`shared/http/`, `shared/db/`) remain in the monolith or move to a shared library.
