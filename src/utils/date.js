const dateFormatter = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDate(isoString) {
  if (!isoString) return ''
  return dateFormatter.format(new Date(isoString))
}

export function formatDateTime(isoString) {
  if (!isoString) return ''
  return dateTimeFormatter.format(new Date(isoString))
}

export function relativeFromNow(isoString) {
  if (!isoString) return ''
  const diffMs = Date.now() - new Date(isoString).getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  const weeks = Math.floor(diffDays / 7)
  if (weeks < 5) return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`
  const months = Math.floor(diffDays / 30)
  return `Hace ${months} mes${months > 1 ? 'es' : ''}`
}
