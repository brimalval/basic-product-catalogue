# Acme Corp Catalog

A product catalog storefront built as a pnpm monorepo. The React frontend communicates exclusively with the Node.js backend, which proxies the [Fake Store API](https://fakestoreapi.com) and manages featured-product preferences and customer enquiries via SQLite.

## Prerequisites

- Node.js 20+
- pnpm 10+

## Quick start

```bash
# 1. Install dependencies
pnpm install

# 2. Create backend environment file
cp apps/backend/.env.example apps/backend/.env

# 3. Apply database schema and seed featured products
pnpm prisma:migrate
pnpm seed

# 4. Start both servers
pnpm dev
```

| Server | URL |
|--------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |

The frontend Vite dev server proxies all `/api/*` requests to the backend — no CORS configuration needed.

## Testing

```bash
pnpm test        # unit + integration tests (backend)
pnpm test:e2e    # end-to-end tests via Playwright (auto-starts both servers)
```

## Build

```bash
pnpm build       # compiles backend (tsc) + frontend (vite build)
```

## Documentation

| Doc | Purpose |
|-----|---------|
| [docs/SETUP.md](docs/SETUP.md) | Full setup, env vars, testing, build, and production checklist |
| [docs/CODEBASE-STRUCTURE.md](docs/CODEBASE-STRUCTURE.md) | Module layout, patterns, HTTP endpoints, data flow |
| [docs/CODEMAPS.md](docs/CODEMAPS.md) | Task → file quick reference for common changes |
| [docs/THEMING.md](docs/THEMING.md) | Design tokens, color swaps, dark mode |
