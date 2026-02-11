# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `pnpm dev` (runs on port 3000)
- **Build:** `pnpm build`
- **Preview prod build:** `pnpm preview`
- **Run tests:** `pnpm test` (Vitest with jsdom)
- **Run single test:** `pnpm test -- src/path/to/test.test.ts`
- **DB migrate:** `pnpm migrate` (runs `scripts/migrate.ts`)
- **DB push schema:** `pnpm db:push` (drizzle-kit push)
- **DB studio:** `pnpm db:studio` (Drizzle Studio GUI)

## Architecture

**Fullstack TypeScript monolith** using React 19 + TanStack Router + TanStack React Start, with SQLite (better-sqlite3) and Drizzle ORM.

### Key directories

- `src/routes/` — File-based routing. Files here auto-generate `src/routeTree.gen.ts` (read-only, don't edit).
- `src/server/` — Backend: database schema (`schema.ts`), singleton DB connection (`db.ts`), server functions (`functions.ts`).
- `scripts/` — Utility scripts (migration).
- `data/` — SQLite database files (gitignored).
- `public/` — Static/PWA assets.

### Data flow pattern

1. **Route loaders** call server functions to fetch data before render
2. **Server functions** (`createServerFn` from `@tanstack/react-start`) handle all server-side logic with Zod validation
3. **Mutations** call server functions then `router.invalidate()` to refetch data
4. **Database transactions** ensure atomicity (e.g., logging interaction + updating lastContactedAt)

### Database

SQLite at `data/friend-crm.db` with WAL mode. Three tables: `friends`, `interactions`, `pushSubscriptions`. Schema defined with Drizzle in `src/server/schema.ts`. DB connection is a singleton to survive HMR.

### Path aliases

`@/*` maps to `./src/*` (configured in both tsconfig.json and vite.config.ts).

### Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin. Single import in `src/styles.css`.

### PWA

Configured via `vite-plugin-pwa` with auto-update service worker and manifest in vite.config.ts.
