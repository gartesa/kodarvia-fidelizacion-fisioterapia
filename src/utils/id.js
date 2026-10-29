export function generateId(prefix = '') {
  const random =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  return prefix ? `${prefix}_${random}` : random
}

export function generatePatientCode(seedIndex) {
  // Short, scannable, human-legible QR payload: no PII inside.
  const suffix =
    seedIndex !== undefined
      ? String(seedIndex).padStart(4, '0')
      : Math.random().toString(36).slice(2, 6).toUpperCase()
  return `KDV-PAT-${suffix}`
}
