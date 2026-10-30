import { useState } from 'react'
import { useAppData } from '../../context/AppDataContext'
import { ADMIN_TABS } from '../../data/constants'
import PatientSearch from './PatientSearch'
import PatientDetailAdmin from './PatientDetailAdmin'
import RewardsManager from './RewardsManager'
import NewsComposer from './NewsComposer'
import ActivityLog from './ActivityLog'

export default function AdminShell() {
  const { adminLogout, patients } = useAppData()
  const [tab, setTab] = useState('pacientes')
  const [selectedPatientId, setSelectedPatientId] = useState(null)

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) ?? null

  return (
    <div className="flex min-h-[calc(100dvh-2.75rem)] flex-col bg-[#F8FAFC] pb-20">
      <header className="sticky top-11 z-20 bg-[#F8FAFC]/90 px-4 pb-2 pt-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Panel de gestión</p>
            <p className="text-sm font-bold text-primary">Equipo Kodarvia</p>
          </div>
          <button
            type="button"
            onClick={adminLogout}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200 hover:text-primary"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 pt-2 sm:px-6">
        {tab === 'pacientes' &&
          (selectedPatient ? (
            <PatientDetailAdmin patient={selectedPatient} onBack={() => setSelectedPatientId(null)} />
          ) : (
            <PatientSearch onSelect={setSelectedPatientId} />
          ))}
        {tab === 'premios' && <RewardsManager />}
        {tab === 'novedades' && <NewsComposer />}
        {tab === 'actividad' && <ActivityLog />}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex max-w-xl">
          {ADMIN_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setTab(t.key)
                if (t.key !== 'pacientes') setSelectedPatientId(null)
              }}
              className="relative flex-1 py-3 text-center text-xs font-semibold"
            >
              <span className={tab === t.key ? 'text-primary' : 'text-slate-400'}>{t.label}</span>
              {tab === t.key && (
                <span className="absolute inset-x-6 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
