import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod/v4'
import { eq, and, asc, desc } from 'drizzle-orm'
import { getDb } from './db'
import { friends, interactions } from './schema'
import { auth } from './auth'

async function requireUser() {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (!session) throw new Error('Unauthorized')
  return session.user
}

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    return session
  },
)

export const getFriends = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await requireUser()
    const db = getDb()

    const allFriends = await db
      .select()
      .from(friends)
      .where(eq(friends.userId, user.id))
      .orderBy(asc(friends.lastContactedAt))

    const recentInteractions = await db
      .select()
      .from(interactions)
      .orderBy(desc(interactions.occurredAt))

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
    const user = await requireUser()
    const db = getDb()
    const id = crypto.randomUUID()
    await db.insert(friends).values({
      id,
      userId: user.id,
      name: data.name,
      frequencyDays: data.frequencyDays,
    })
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
    const user = await requireUser()
    const db = getDb()
    const occurredAt = data.occurredAt || new Date().toISOString()
    const id = crypto.randomUUID()

    // Verify the friend belongs to this user
    const [friend] = await db
      .select()
      .from(friends)
      .where(and(eq(friends.id, data.friendId), eq(friends.userId, user.id)))

    if (!friend) throw new Error('Friend not found')

    // Atomic batch: insert interaction + update last_contacted_at
    await db.batch([
      db.insert(interactions).values({
        id,
        friendId: data.friendId,
        type: data.type,
        occurredAt,
        notes: data.notes ?? null,
      }),
      db
        .update(friends)
        .set({ lastContactedAt: occurredAt })
        .where(eq(friends.id, data.friendId)),
    ])

    return { id }
  })
