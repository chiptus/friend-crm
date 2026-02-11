import { useEffect, useRef, useCallback } from 'react'

interface PopoverProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Popover({ open, onClose, children }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback(
    (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    },
    [onClose],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (!ref.current) return
      const items = ref.current.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
      if (!items.length) return
      const active = document.activeElement as HTMLElement
      const currentIndex = Array.from(items).indexOf(active as HTMLButtonElement)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        items[next].focus()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        items[prev].focus()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('pointerdown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    // Focus first menu item
    requestAnimationFrame(() => {
      const firstItem = ref.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')
      firstItem?.focus()
    })

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, handleClickOutside, handleKeyDown])

  if (!open) return null

  return (
    <div
      ref={ref}
      role="menu"
      className="absolute top-full right-0 z-50 mt-2 w-48 rounded-xl border border-gray-100 bg-surface-raised py-1 shadow-xl"
      style={{ animation: 'popover-in 0.15s ease-out' }}
    >
      {children}
    </div>
  )
}
