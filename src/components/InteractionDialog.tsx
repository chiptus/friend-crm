import { useState } from 'react'
import { Dialog } from './Dialog'
import { INTERACTION_TYPES } from './InteractionPopover'

interface InteractionDialogProps {
  open: boolean
  onClose: () => void
  friendName: string
  onSubmit: (type: 'call' | 'message' | 'meet', date: string, notes: string) => Promise<void>
}

export function InteractionDialog({ open, onClose, friendName, onSubmit }: InteractionDialogProps) {
  const [type, setType] = useState<'call' | 'message' | 'meet'>('message')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(type, new Date(date + 'T12:00:00').toISOString(), notes)
      setNotes('')
      setDate(new Date().toISOString().slice(0, 10))
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={`Log interaction with ${friendName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type selector */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Type</label>
          <div className="flex gap-2">
            {INTERACTION_TYPES.map(({ type: t, label, icon: Icon }) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  type === t
                    ? 'border-brand-400 bg-brand-50 text-brand-700'
                    : 'border-gray-200 bg-surface text-gray-600 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="interaction-date" className="mb-1.5 block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            id="interaction-date"
            type="date"
            value={date}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-2.5 text-sm transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="interaction-notes" className="mb-1.5 block text-sm font-medium text-gray-700">
            Notes <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="interaction-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you talk about?"
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-200 bg-surface px-4 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>

        {/* Actions */}
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
            {submitting ? 'Logging...' : 'Log Interaction'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
