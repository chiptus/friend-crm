import { useState } from 'react'
import { Activity } from 'lucide-react'
import { InteractionPopover } from './InteractionPopover'
import { InteractionDialog } from './InteractionDialog'
import { isOverdue, getAvatarColor, formatRelativeDate, interactionLabel } from '@/lib/utils'

interface Interaction {
  id: string
  type: string
  occurredAt: string
}

interface Friend {
  id: string
  name: string
  frequencyDays: number | null
  lastContactedAt: string | null
  recentInteractions: Interaction[]
}

interface FriendCardProps {
  friend: Friend
  onLogInteraction: (friendId: string, type: 'call' | 'message' | 'meet', occurredAt?: string, notes?: string) => Promise<void>
}

export function FriendCard({ friend, onLogInteraction }: FriendCardProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const overdue = isOverdue(friend.lastContactedAt, friend.frequencyDays)
  const avatarColor = getAvatarColor(friend.name)
  const initial = friend.name.charAt(0).toUpperCase()

  const lastInteraction = friend.recentInteractions[0]
  const lastLabel = lastInteraction
    ? `${interactionLabel(lastInteraction.type)} ${formatRelativeDate(lastInteraction.occurredAt)}`
    : 'Never contacted'

  const lastByType = new Map<string, string>()
  for (const i of friend.recentInteractions) {
    if (!lastByType.has(i.type)) {
      lastByType.set(i.type, i.occurredAt)
    }
  }
  const tooltipLines = Array.from(lastByType, ([type, date]) =>
    `${interactionLabel(type)} ${formatRelativeDate(date)}`,
  )

  return (
    <div
      className={`relative flex items-center gap-4 rounded-2xl border bg-surface-raised px-5 py-4 shadow-sm transition-shadow hover:shadow-md ${
        popoverOpen ? 'z-10' : ''
      } ${
        overdue
          ? 'border-l-4 border-l-status-overdue border-t-gray-100 border-r-gray-100 border-b-gray-100'
          : 'border-l-4 border-l-status-ok border-t-gray-100 border-r-gray-100 border-b-gray-100'
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold ${avatarColor.bg} ${avatarColor.text}`}
      >
        {initial}
      </div>

      {/* Info */}
      <div className="group min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900">{friend.name}</p>
        <div className="relative inline-block">
          <p className="cursor-default text-xs text-gray-500">
            {lastLabel}
            {' \u00b7 '}
            Every {friend.frequencyDays ?? 7}d
          </p>
          {tooltipLines.length > 0 && (
            <div className="pointer-events-none absolute left-0 top-full z-50 mt-1.5 hidden w-max max-w-xs rounded-lg bg-gray-900 px-3 py-2 text-xs text-gray-100 shadow-lg group-hover:block">
              <p className="mb-1 font-medium text-gray-400">Recent activity</p>
              {tooltipLines.map((line, i) => (
                <p key={i} className="py-0.5">{line}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interaction trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setPopoverOpen((v) => !v)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
            overdue
              ? 'bg-status-overdue/10 text-status-overdue hover:bg-status-overdue/20'
              : 'bg-brand-50 text-brand-500 hover:bg-brand-100'
          }`}
          aria-label={`Log interaction with ${friend.name}`}
        >
          <Activity size={18} />
        </button>
        <InteractionPopover
          open={popoverOpen}
          onClose={() => setPopoverOpen(false)}
          onSelect={(type) => onLogInteraction(friend.id, type)}
          onAddDetails={() => setDialogOpen(true)}
        />
      </div>

      {/* Detailed interaction dialog */}
      <InteractionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        friendName={friend.name}
        onSubmit={(type, occurredAt, notes) => onLogInteraction(friend.id, type, occurredAt, notes)}
      />
    </div>
  )
}
