const AVATAR_COLORS = [
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-sky-100', text: 'text-sky-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-violet-100', text: 'text-violet-700' },
  { bg: 'bg-pink-100', text: 'text-pink-700' },
  { bg: 'bg-teal-100', text: 'text-teal-700' },
  { bg: 'bg-orange-100', text: 'text-orange-700' },
] as const

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function getAvatarColor(name: string) {
  return AVATAR_COLORS[hashString(name) % AVATAR_COLORS.length]
}

export function isOverdue(
  lastContactedAt: string | null,
  frequencyDays: number | null,
): boolean {
  if (!lastContactedAt) return true
  const last = new Date(lastContactedAt).getTime()
  const now = Date.now()
  const diffDays = (now - last) / (1000 * 60 * 60 * 24)
  return diffDays > (frequencyDays ?? 7)
}

const INTERACTION_LABELS: Record<string, string> = {
  call: 'Called',
  message: 'Messaged',
  meet: 'Met',
}

export function interactionLabel(type: string): string {
  return INTERACTION_LABELS[type] ?? type
}

export function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return 'Never'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return date.toLocaleDateString()
}
