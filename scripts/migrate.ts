/**
 * D1 Database Migration
 *
 * With Cloudflare D1, migrations work differently than local SQLite:
 *
 * 1. Generate migrations from schema changes:
 *    pnpm db:generate
 *
 * 2. Apply migrations locally (dev):
 *    pnpm db:migrate:local
 *
 * 3. Apply migrations to production D1:
 *    pnpm db:migrate:prod
 *
 * The Cloudflare Vite plugin handles local D1 during `pnpm dev` automatically.
 */

console.log(`D1 Migration Guide:

1. Generate migration SQL from schema:
   pnpm db:generate

2. Apply to local D1 (for testing):
   pnpm db:migrate:local

3. Apply to production D1:
   pnpm db:migrate:prod

See: https://developers.cloudflare.com/d1/reference/migrations/
`)
