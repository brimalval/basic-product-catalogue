# Setup Guide

## Prerequisites

- Node.js 20+
- pnpm 9+

## Installation

```bash
pnpm install
```

## Environment

Create `apps/backend/.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3001
NODE_ENV=development
```

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
