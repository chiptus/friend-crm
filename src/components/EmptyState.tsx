import { UserPlus } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-500">
        <UserPlus size={28} />
      </div>
      <h2 className="mb-1 text-lg font-semibold text-gray-900">No friends yet</h2>
      <p className="text-sm text-gray-500">
        Tap the <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] text-white align-text-bottom font-bold">+</span> button to add someone
      </p>
    </div>
  )
}
