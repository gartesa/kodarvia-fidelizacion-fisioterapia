import { STORAGE_KEYS, SEED_VERSION } from './constants'
import { buildSeedData } from './seed'

export function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage lleno o bloqueado (modo privado): la app sigue funcionando
    // en memoria durante la sesión actual.
  }
}

function applySeed() {
  const seed = buildSeedData()
  writeJson(STORAGE_KEYS.patients, seed.patients)
  writeJson(STORAGE_KEYS.rewards, seed.rewards)
  writeJson(STORAGE_KEYS.news, seed.news)
  writeJson(STORAGE_KEYS.history, seed.history)
  writeJson(STORAGE_KEYS.seedVersion, SEED_VERSION)
}

/**
 * Garantiza que localStorage nunca arranque vacío y migra datos de demo
 * antiguos cuando cambia la forma del seed (SEED_VERSION).
 */
export function ensureSeeded() {
  const currentVersion = readJson(STORAGE_KEYS.seedVersion, 0)
  const hasPatients = readJson(STORAGE_KEYS.patients, null)

  if (!hasPatients || currentVersion !== SEED_VERSION) {
    applySeed()
  }
}

export function resetDemoData() {
  applySeed()
  window.localStorage.removeItem(STORAGE_KEYS.currentPatientId)
  window.localStorage.removeItem(STORAGE_KEYS.adminSession)
  window.localStorage.removeItem(STORAGE_KEYS.activeRole)
}
