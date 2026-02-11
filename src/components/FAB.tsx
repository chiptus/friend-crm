import { Plus } from 'lucide-react'

interface FABProps {
  onClick: () => void
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/40 active:scale-95"
      style={{ animation: 'fab-in 0.3s ease-out' }}
      aria-label="Add a friend"
    >
      <Plus size={24} strokeWidth={2.5} />
    </button>
  )
}
