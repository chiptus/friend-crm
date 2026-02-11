import { Phone, MessageSquare, Users, PenLine } from 'lucide-react'
import { Popover } from './Popover'

export const INTERACTION_TYPES = [
  { type: 'call' as const, label: 'Call', icon: Phone },
  { type: 'message' as const, label: 'Message', icon: MessageSquare },
  { type: 'meet' as const, label: 'In Person', icon: Users },
]

interface InteractionPopoverProps {
  open: boolean
  onClose: () => void
  onSelect: (type: 'call' | 'message' | 'meet') => void
  onAddDetails: () => void
}

export function InteractionPopover({ open, onClose, onSelect, onAddDetails }: InteractionPopoverProps) {
  return (
    <Popover open={open} onClose={onClose}>
      {INTERACTION_TYPES.map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          role="menuitem"
          onClick={() => {
            onSelect(type)
            onClose()
          }}
          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors focus:bg-brand-50 focus:text-brand-700 focus:outline-none"
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
      <div className="border-t border-gray-100">
        <button
          role="menuitem"
          onClick={() => {
            onAddDetails()
            onClose()
          }}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs text-gray-400 hover:bg-brand-50 hover:text-brand-700 transition-colors focus:bg-brand-50 focus:text-brand-700 focus:outline-none"
        >
          <PenLine size={14} />
          <span>Add details...</span>
        </button>
      </div>
    </Popover>
  )
}
