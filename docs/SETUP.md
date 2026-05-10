# Setup Guide

## Prerequisites

- Node.js 20+
- pnpm 9+

## Installation

```bash
pnpm install
```

## Environment

Create `apps/backend/.env` by copying the example file:

```bash
cp apps/backend/.env.example apps/backend/.env
```

The required vars (`DATABASE_URL`, `PORT`, `NODE_ENV`) are already filled in the example. Edit them only if you need non-default values.

**SMTP (optional — dev stub is active by default)**

When `SMTP_HOST` is set, the enquiry module sends real emails instead of writing to `.dev-mail/`. All SMTP vars are required together:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@example.com
MAIL_TO=sales@example.com
FRONTEND_URL=https://yourstore.com   # used in email product links
```

If none of these are set, enquiries are written to `.dev-mail/*.json` (gitignored) — no SMTP configuration needed for local development.

## Database

Apply the schema and seed featured product preferences:

```bash
pnpm prisma:migrate   # runs prisma migrate dev
pnpm seed             # seeds featured product preferences
```

## Development

Start both servers concurrently:

```bash
pnpm dev
```

- Backend: http://localhost:3001
- Frontend: http://localhost:5173 (proxies `/api` → backend)

Or start each individually:

```bash
pnpm --filter @catalog/backend dev
pnpm --filter @catalog/frontend dev
```

## Testing

### Unit + integration tests

```bash
pnpm test
```

Backend test coverage includes:
- Repository tests (SQLite integration, isolated temp DB per run)
- Service tests (mocked dependencies)
- HTTP layer tests (real HTTP server, mocked services)

### End-to-end tests

```bash
pnpm test:e2e
```

Runs Playwright against Chromium. The test runner automatically starts both the backend and frontend dev servers — no manual `pnpm dev` needed before running E2E tests. Tests live in `e2e/catalog.spec.ts`.

## Build

```bash
pnpm build         # compiles backend (tsc) and frontend (vite)
```

## Production start

```bash
# After build:
pnpm --filter @catalog/backend start   # node dist/server.js
pnpm --filter @catalog/frontend preview
```

## Dev mail

Enquiry submissions are written to `.dev-mail/` as JSON files (gitignored). No SMTP setup required.

## Troubleshooting

**Port already in use**
The backend defaults to `:3001` and the frontend to `:5173`. If either port is occupied:
- Find and stop the conflicting process: `lsof -i :3001` / `lsof -i :5173`
- Or change the backend port via `PORT=<other>` in `.env` and update the Vite proxy in `apps/frontend/vite.config.ts` to match.

**`pnpm prisma:migrate` fails**
- Ensure `DATABASE_URL` is set in `apps/backend/.env`.
- If the SQLite file is corrupt, delete `apps/backend/prisma/dev.db` and re-run migrate + seed.

**Fake Store API is unavailable**
The backend proxies product data from `https://fakestoreapi.com`. If the upstream API is down, product endpoints will return `502`. There is no offline fallback — wait for the upstream to recover or mock the adapter in development.

**Enquiries not arriving by email**
Without SMTP vars set, enquiries are written to `.dev-mail/*.json` (gitignored) as a dev stub. Check that directory first. To send real emails, set all `SMTP_*` vars in `.env` (see Environment section above).

## Before deploying to production

1. **SEO base URL** — update `BASE_URL` in `apps/frontend/src/hooks/use-seo.ts` and the `<loc>` entries in `apps/frontend/public/sitemap.xml` to your real domain.
2. **SMTP** — set all `SMTP_*` vars in the production environment (see above).
3. **SQLite** — swap `DATABASE_URL` for a production-grade database (Postgres recommended) and update `prisma/schema.prisma` `provider` accordingly.
