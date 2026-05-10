# Setup Guide

## Prerequisites

- Node.js 20+
- pnpm 9+

## Installation

```bash
pnpm install
```

## Environment

Create `apps/backend/.env` (copy from `.env.example`):

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3001
NODE_ENV=development
```

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

```bash
pnpm test          # unit + integration tests (backend only)
```

Backend test coverage includes:
- Repository tests (SQLite integration, isolated temp DB per run)
- Service tests (mocked dependencies)
- HTTP layer tests (real HTTP server, mocked services)

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

## Before deploying to production

1. **SEO base URL** — update `BASE_URL` in `apps/frontend/src/hooks/use-seo.ts` and the `<loc>` entries in `apps/frontend/public/sitemap.xml` to your real domain.
2. **SMTP** — set all `SMTP_*` vars in the production environment (see above).
3. **SQLite** — swap `DATABASE_URL` for a production-grade database (Postgres recommended) and update `prisma/schema.prisma` `provider` accordingly.
