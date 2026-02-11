import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod/v4'
import { eq, asc, desc } from 'drizzle-orm'
import { db } from './db'
import { friends, interactions } from './schema'

export const getFriends = createServerFn({ method: 'GET' }).handler(
  async () => {
    const allFriends = db
      .select()
      .from(friends)
      .orderBy(asc(friends.lastContactedAt))
      .all()

    const recentInteractions = db
      .select()
      .from(interactions)
      .orderBy(desc(interactions.occurredAt))
      .all()

    const interactionsByFriend = new Map<string, typeof recentInteractions>()
    for (const i of recentInteractions) {
      if (!i.friendId) continue
      const list = interactionsByFriend.get(i.friendId) ?? []
      list.push(i)
      interactionsByFriend.set(i.friendId, list)
    }

    return allFriends.map((f) => ({
      ...f,
      recentInteractions: (interactionsByFriend.get(f.id) ?? []).slice(0, 10),
    }))
  },
)

const addFriendSchema = z.object({
  name: z.string().min(1),
  frequencyDays: z.number().int().positive().default(7),
})

export const addFriend = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => addFriendSchema.parse(data))
  .handler(async ({ data }) => {
    const id = crypto.randomUUID()
    db.insert(friends)
      .values({
        id,
        name: data.name,
        frequencyDays: data.frequencyDays,
      })
      .run()
    return { id }
  })

const logInteractionSchema = z.object({
  friendId: z.string().uuid(),
  type: z.enum(['call', 'message', 'meet']),
  notes: z.string().optional(),
  occurredAt: z.string().optional(),
})

export const logInteraction = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => logInteractionSchema.parse(data))
  .handler(async ({ data }) => {
    const occurredAt = data.occurredAt || new Date().toISOString()
    const id = crypto.randomUUID()

    // Single transaction: insert interaction + update last_contacted_at
    db.transaction((tx) => {
      tx.insert(interactions)
        .values({
          id,
          friendId: data.friendId,
          type: data.type,
          occurredAt,
          notes: data.notes ?? null,
        })
        .run()

      tx.update(friends)
        .set({ lastContactedAt: occurredAt })
        .where(eq(friends.id, data.friendId))
        .run()
    })

    return { id }
  })
