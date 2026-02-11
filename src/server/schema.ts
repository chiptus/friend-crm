import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const friends = sqliteTable('friends', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  frequencyDays: integer('frequency_days').default(7),
  lastContactedAt: text('last_contacted_at'),
})

export const interactions = sqliteTable('interactions', {
  id: text('id').primaryKey(),
  friendId: text('friend_id').references(() => friends.id),
  type: text('type', { enum: ['call', 'message', 'meet'] }).notNull(),
  occurredAt: text('occurred_at').notNull(),
  notes: text('notes'),
})

export const pushSubscriptions = sqliteTable('push_subscriptions', {
  id: text('id').primaryKey(),
  endpoint: text('endpoint').unique(),
  p256dh: text('p256dh'),
  auth: text('auth'),
})
