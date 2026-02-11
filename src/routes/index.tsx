import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { getFriends, addFriend, logInteraction } from '../server/functions'
import { Plus } from 'lucide-react'
import { AddFriendDialog } from '@/components/AddFriendDialog'
import { FriendCard } from '@/components/FriendCard'
import { EmptyState } from '@/components/EmptyState'

export const Route = createFileRoute('/')({
  loader: () => getFriends(),
  component: HomeComponent,
})

function HomeComponent() {
  const friends = Route.useLoaderData()
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
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:scale-95 transition-all"
            aria-label="Add a friend"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
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
