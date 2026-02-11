import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { sql } from 'drizzle-orm'
import * as schema from '../src/server/schema'

const sqlite = new Database('./data/friend-crm.db')
sqlite.pragma('journal_mode = WAL')

const db = drizzle(sqlite, { schema })

// Create tables if they don't exist
db.run(sql`
  CREATE TABLE IF NOT EXISTS friends (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    frequency_days INTEGER DEFAULT 7,
    last_contacted_at TEXT
  )
`)

db.run(sql`
  CREATE TABLE IF NOT EXISTS interactions (
    id TEXT PRIMARY KEY,
    friend_id TEXT REFERENCES friends(id),
    type TEXT NOT NULL CHECK(type IN ('call', 'message', 'meet')),
    occurred_at TEXT NOT NULL,
    notes TEXT
  )
`)

db.run(sql`
  CREATE TABLE IF NOT EXISTS push_subscriptions (
    id TEXT PRIMARY KEY,
    endpoint TEXT UNIQUE,
    p256dh TEXT,
    auth TEXT
  )
`)

console.log('Database migrated successfully.')
sqlite.close()
