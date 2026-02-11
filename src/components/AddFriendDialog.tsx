import { useState } from 'react'
import { Dialog } from './Dialog'

interface AddFriendDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (name: string, frequencyDays: number) => Promise<void>
}

export function AddFriendDialog({ open, onClose, onAdd }: AddFriendDialogProps) {
  const [name, setName] = useState('')
  const [frequency, setFrequency] = useState(7)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await onAdd(name.trim(), frequency)
      setName('')
      setFrequency(7)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Add a friend">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="friend-name" className="mb-1.5 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="friend-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Who do you want to keep in touch with?"
            required
            autoFocus
            className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="friend-frequency" className="mb-1.5 block text-sm font-medium text-gray-700">
            Contact every
          </label>
          <div className="flex items-center gap-2">
            <input
              id="friend-frequency"
              type="number"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              min={1}
              className="w-20 rounded-xl border border-gray-200 bg-surface px-4 py-2.5 text-sm transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
            <span className="text-sm text-gray-500">days</span>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Adding...' : 'Add Friend'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
