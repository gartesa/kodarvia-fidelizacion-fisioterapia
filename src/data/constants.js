export const STORAGE_PREFIX = 'kodarvia_fidelizacion_'

export const STORAGE_KEYS = {
  patients: `${STORAGE_PREFIX}patients`,
  rewards: `${STORAGE_PREFIX}rewards`,
  news: `${STORAGE_PREFIX}news`,
  history: `${STORAGE_PREFIX}history`,
  currentPatientId: `${STORAGE_PREFIX}current_patient_id`,
  activeRole: `${STORAGE_PREFIX}active_role`,
  adminSession: `${STORAGE_PREFIX}admin_session`,
  seedVersion: `${STORAGE_PREFIX}seed_version`,
}

// Bump this when SEED data shape changes so returning demos get the new seed.
export const SEED_VERSION = 3

export const LEVELS = [
  { key: 'bronce', label: 'Bronce', min: 0, color: '#B08D57', bg: '#FBF4EC' },
  { key: 'plata', label: 'Plata', min: 400, color: '#64748B', bg: '#F1F5F9' },
  { key: 'oro', label: 'Oro', min: 900, color: '#B8860B', bg: '#FDF8E8' },
]

export const PATIENT_TABS = [
  { key: 'tarjeta', label: 'Tarjeta' },
  { key: 'premios', label: 'Premios' },
  { key: 'novedades', label: 'Novedades' },
]

export const ADMIN_TABS = [
  { key: 'pacientes', label: 'Pacientes' },
  { key: 'premios', label: 'Premios' },
  { key: 'novedades', label: 'Novedades' },
  { key: 'actividad', label: 'Actividad' },
]

export const REWARD_CATEGORIES = [
  'Evaluación',
  'Equipamiento',
  'Terapia manual',
  'Recuperación',
  'Prevención',
]

export const ADMIN_DEMO_CREDENTIALS = {
  user: 'admin',
  pass: 'kodarvia2026',
}
