import { useRef, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) {
      el.showModal()
    } else if (!open && el.open) {
      el.close()
    }
  }, [open])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="m-auto w-full max-w-md rounded-2xl border-0 bg-surface-raised p-0 shadow-2xl backdrop:bg-transparent"
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </dialog>
  )
}
