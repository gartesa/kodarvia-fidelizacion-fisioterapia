import { useState } from 'react'
import { useAppData } from '../../context/AppDataContext'
import { PATIENT_TABS } from '../../data/constants'
import LoyaltyCard from './LoyaltyCard'
import RewardsCatalog from './RewardsCatalog'
import NewsFeed from './NewsFeed'

export default function PatientShell({ patient }) {
  const { logoutPatient, news } = useAppData()
  const [tab, setTab] = useState('tarjeta')

  const unreadCount = news.filter((n) => !n.readBy.includes(patient.id)).length

  return (
    <div className="flex min-h-[calc(100dvh-2.75rem)] flex-col bg-[#F8FAFC] pb-20">
      <header className="sticky top-11 z-20 bg-[#F8FAFC]/90 px-4 pb-2 pt-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Hola,</p>
            <p className="text-sm font-bold text-primary">{patient.name.split(' ')[0]}</p>
          </div>
          <button
            type="button"
            onClick={logoutPatient}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200 hover:text-primary"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 pt-2 sm:px-6">
        {tab === 'tarjeta' && <LoyaltyCard patient={patient} />}
        {tab === 'premios' && <RewardsCatalog patient={patient} />}
        {tab === 'novedades' && <NewsFeed patient={patient} />}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex max-w-xl">
          {PATIENT_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className="relative flex-1 py-3 text-center text-xs font-semibold"
            >
              <span className={tab === t.key ? 'text-primary' : 'text-slate-400'}>{t.label}</span>
              {t.key === 'novedades' && unreadCount > 0 && (
                <span className="absolute right-[28%] top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
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
