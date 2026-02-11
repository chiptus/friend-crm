import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

// Singleton to prevent multiple connections during HMR
const globalForDb = globalThis as unknown as {
  __db?: ReturnType<typeof drizzle<typeof schema>>
}

function createDb() {
  const sqlite = new Database('./data/friend-crm.db')
  sqlite.pragma('journal_mode = WAL')
  return drizzle(sqlite, { schema })
}

export const db = globalForDb.__db ?? (globalForDb.__db = createDb())
