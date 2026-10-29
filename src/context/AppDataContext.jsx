import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { STORAGE_KEYS, ADMIN_DEMO_CREDENTIALS } from '../data/constants'
import { ensureSeeded, readJson, writeJson, resetDemoData as resetStorage } from '../data/storage'
import { generateId, generatePatientCode } from '../utils/id'
import { downloadCsv } from '../utils/csv'
import { formatDate } from '../utils/date'

ensureSeeded()

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [patients, setPatients] = useState(() => readJson(STORAGE_KEYS.patients, []))
  const [rewards, setRewards] = useState(() => readJson(STORAGE_KEYS.rewards, []))
  const [news, setNews] = useState(() => readJson(STORAGE_KEYS.news, []))
  const [history, setHistory] = useState(() => readJson(STORAGE_KEYS.history, []))
  const [currentPatientId, setCurrentPatientId] = useState(() =>
    readJson(STORAGE_KEYS.currentPatientId, null)
  )
  const [activeRole, setActiveRoleState] = useState(() =>
    readJson(STORAGE_KEYS.activeRole, 'patient')
  )
  const [isAdminAuthed, setIsAdminAuthed] = useState(() =>
    readJson(STORAGE_KEYS.adminSession, false)
  )
  const [toast, setToast] = useState(null)

  const notify = useCallback((message, tone = 'success') => {
    setToast({ message, tone, key: generateId() })
  }, [])

  const persistPatients = useCallback((next) => {
    setPatients(next)
    writeJson(STORAGE_KEYS.patients, next)
  }, [])

  const persistHistory = useCallback((next) => {
    setHistory(next)
    writeJson(STORAGE_KEYS.history, next)
  }, [])

  const persistNews = useCallback((next) => {
    setNews(next)
    writeJson(STORAGE_KEYS.news, next)
  }, [])

  const setActiveRole = useCallback((role) => {
    setActiveRoleState(role)
    writeJson(STORAGE_KEYS.activeRole, role)
  }, [])

  const currentPatient = useMemo(
    () => patients.find((p) => p.id === currentPatientId) ?? null,
    [patients, currentPatientId]
  )

  const loginAsPatient = useCallback((patientId) => {
    setCurrentPatientId(patientId)
    writeJson(STORAGE_KEYS.currentPatientId, patientId)
  }, [])

  const logoutPatient = useCallback(() => {
    setCurrentPatientId(null)
    writeJson(STORAGE_KEYS.currentPatientId, null)
  }, [])

  const registerPatient = useCallback(
    ({ name, email, phone, sport, consentAccepted }) => {
      const id = generateId('p')
      const newPatient = {
        id,
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || '',
        sport: sport?.trim() || 'Paciente de fisioterapia',
        joinedAt: new Date().toISOString(),
        qrId: generatePatientCode(),
        points: 0,
        consentAccepted: Boolean(consentAccepted),
      }
      const nextPatients = [...patients, newPatient]
      persistPatients(nextPatients)

      const welcomeEntry = {
        id: generateId('hist'),
        patientId: id,
        patientName: newPatient.name,
        type: 'acreditacion',
        description: 'Bono de bienvenida al programa de fidelización',
        points: 50,
        date: new Date().toISOString(),
        by: 'admin',
      }
      const nextPatientsWithBonus = nextPatients.map((p) =>
        p.id === id ? { ...p, points: p.points + welcomeEntry.points } : p
      )
      persistPatients(nextPatientsWithBonus)
      persistHistory([welcomeEntry, ...history])

      loginAsPatient(id)
      return id
    },
    [patients, history, persistPatients, persistHistory, loginAsPatient]
  )

  const findPatientByCode = useCallback(
    (code) => patients.find((p) => p.qrId.toLowerCase() === code.trim().toLowerCase()) ?? null,
    [patients]
  )

  const accreditPoints = useCallback(
    (patientId, points, description) => {
      const patient = patients.find((p) => p.id === patientId)
      if (!patient || !Number.isFinite(points) || points <= 0) {
        return { success: false, message: 'Monto de puntos inválido.' }
      }

      const nextPatients = patients.map((p) =>
        p.id === patientId ? { ...p, points: p.points + points } : p
      )
      const entry = {
        id: generateId('hist'),
        patientId,
        patientName: patient.name,
        type: 'acreditacion',
        description: description?.trim() || 'Sesión de kinesiología deportiva',
        points,
        date: new Date().toISOString(),
        by: 'admin',
      }

      persistPatients(nextPatients)
      persistHistory([entry, ...history])
      notify(`+${points} pts acreditados a ${patient.name}.`)
      return { success: true }
    },
    [patients, history, persistPatients, persistHistory, notify]
  )

  const redeemReward = useCallback(
    (patientId, rewardId, { by = 'paciente' } = {}) => {
      const patient = patients.find((p) => p.id === patientId)
      const reward = rewards.find((r) => r.id === rewardId)

      if (!patient || !reward) {
        return { success: false, message: 'Paciente o premio no encontrado.' }
      }
      if (patient.points < reward.pointsCost) {
        return { success: false, message: 'Puntos insuficientes para este canje.' }
      }

      const nextPatients = patients.map((p) =>
        p.id === patientId ? { ...p, points: p.points - reward.pointsCost } : p
      )
      const entry = {
        id: generateId('hist'),
        patientId,
        patientName: patient.name,
        type: 'canje',
        description: `Canje: ${reward.name}`,
        points: -reward.pointsCost,
        date: new Date().toISOString(),
        by,
      }

      persistPatients(nextPatients)
      persistHistory([entry, ...history])
      notify(`Canje registrado: ${reward.name}.`)
      return { success: true }
    },
    [patients, rewards, history, persistPatients, persistHistory, notify]
  )

  const addNews = useCallback(
    ({ title, body, badge }) => {
      const entry = {
        id: generateId('news'),
        title: title.trim(),
        body: body.trim(),
        badge: badge?.trim() || 'Novedad',
        date: new Date().toISOString(),
        readBy: [],
      }
      persistNews([entry, ...news])
      notify('Publicación creada. Ya está visible en el feed del paciente.')
      return entry
    },
    [news, persistNews, notify]
  )

  const markNewsRead = useCallback(
    (newsId, patientId) => {
      const nextNews = news.map((item) =>
        item.id === newsId && !item.readBy.includes(patientId)
          ? { ...item, readBy: [...item.readBy, patientId] }
          : item
      )
      persistNews(nextNews)
    },
    [news, persistNews]
  )

  const adminLogin = useCallback(
    (user, pass) => {
      const ok = user === ADMIN_DEMO_CREDENTIALS.user && pass === ADMIN_DEMO_CREDENTIALS.pass
      if (ok) {
        setIsAdminAuthed(true)
        writeJson(STORAGE_KEYS.adminSession, true)
      }
      return ok
    },
    []
  )

  const adminLogout = useCallback(() => {
    setIsAdminAuthed(false)
    writeJson(STORAGE_KEYS.adminSession, false)
  }, [])

  const exportHistoryCsv = useCallback(
    (entries) => {
      const rows = (entries ?? history).map((entry) => [
        formatDate(entry.date),
        entry.patientName,
        entry.type === 'acreditacion' ? 'Acreditación de puntos' : 'Canje de premio',
        entry.points,
      ])
      downloadCsv(
        `kodarvia-actividad-${new Date().toISOString().slice(0, 10)}.csv`,
        ['fecha', 'paciente', 'accion', 'puntos'],
        rows
      )
    },
    [history]
  )

  const resetDemoData = useCallback(() => {
    resetStorage()
    setPatients(readJson(STORAGE_KEYS.patients, []))
    setRewards(readJson(STORAGE_KEYS.rewards, []))
    setNews(readJson(STORAGE_KEYS.news, []))
    setHistory(readJson(STORAGE_KEYS.history, []))
    setCurrentPatientId(null)
    setIsAdminAuthed(false)
    setActiveRoleState('patient')
    notify('Datos de ejemplo restaurados.')
  }, [notify])

  const value = useMemo(
    () => ({
      patients,
      rewards,
      news,
      history,
      currentPatient,
      currentPatientId,
      activeRole,
      isAdminAuthed,
      toast,
      setToast,
      notify,
      setActiveRole,
      loginAsPatient,
      logoutPatient,
      registerPatient,
      findPatientByCode,
      accreditPoints,
      redeemReward,
      addNews,
      markNewsRead,
      adminLogin,
      adminLogout,
      exportHistoryCsv,
      resetDemoData,
    }),
    [
      patients,
      rewards,
      news,
      history,
      currentPatient,
      currentPatientId,
      activeRole,
      isAdminAuthed,
      toast,
      notify,
      setActiveRole,
      loginAsPatient,
      logoutPatient,
      registerPatient,
      findPatientByCode,
      accreditPoints,
      redeemReward,
      addNews,
      markNewsRead,
      adminLogin,
      adminLogout,
      exportHistoryCsv,
      resetDemoData,
    ]
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData debe usarse dentro de <AppDataProvider>')
  return ctx
}
