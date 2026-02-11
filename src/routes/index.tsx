import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { getFriends, getSession, addFriend, logInteraction } from '../server/functions'
import { signOut } from '@/lib/auth-client'
import { Plus, LogOut } from 'lucide-react'
import { AddFriendDialog } from '@/components/AddFriendDialog'
import { FriendCard } from '@/components/FriendCard'
import { EmptyState } from '@/components/EmptyState'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return { session }
  },
  loader: () => getFriends(),
  component: HomeComponent,
})

function HomeComponent() {
  const friends = Route.useLoaderData()
  const { session } = Route.useRouteContext()
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddFriend = async (name: string, frequencyDays: number) => {
    await addFriend({ data: { name, frequencyDays } })
    router.invalidate()
  }

  const handleLogInteraction = async (friendId: string, type: 'call' | 'message' | 'meet', occurredAt?: string, notes?: string) => {
    await logInteraction({ data: { friendId, type, occurredAt, notes: notes || undefined } })
    router.invalidate()
  }

  const handleSignOut = async () => {
    await signOut()
    router.invalidate()
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-2xl px-4 py-8 pb-24">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Friend CRM</h1>
            <p className="mt-1 text-sm text-gray-500">
              {friends.length > 0
                ? `${friends.length} friend${friends.length === 1 ? '' : 's'} to keep in touch with`
                : 'Keep in touch with the people who matter'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name ?? ''}
                className="h-8 w-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:scale-95 transition-all"
              aria-label="Add a friend"
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Friend list */}
        {friends.length > 0 ? (
          <div className="space-y-3">
            {friends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onLogInteraction={handleLogInteraction}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Add Friend Dialog */}
      <AddFriendDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddFriend}
      />
    </div>
  )
}
