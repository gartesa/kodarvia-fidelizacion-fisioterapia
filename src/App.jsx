import { useState } from 'react'
import { useAppData } from './context/AppDataContext'
import BrandMark from './components/shared/BrandMark'
import RoleSwitcher from './components/shared/RoleSwitcher'
import Toast from './components/shared/Toast'
import PatientAuthScreen from './components/patient/PatientAuthScreen'
import PatientShell from './components/patient/PatientShell'
import AdminAuthScreen from './components/admin/AdminAuthScreen'
import AdminShell from './components/admin/AdminShell'

export default function App() {
  const { activeRole, currentPatient, isAdminAuthed, resetDemoData } = useAppData()
  const [confirmingReset, setConfirmingReset] = useState(false)

  function handleReset() {
    if (!confirmingReset) {
      setConfirmingReset(true)
      window.setTimeout(() => setConfirmingReset(false), 3000)
      return
    }
    resetDemoData()
    setConfirmingReset(false)
  }

  return (
    <div className="min-h-[100dvh] bg-[#F8FAFC]">
      <div className="sticky top-0 z-30 flex h-11 items-center justify-between bg-primary px-3 sm:px-5">
        <div className="flex items-center gap-2">
          <BrandMark size={26} />
          <span className="hidden text-xs font-bold text-white sm:inline">Kodarvia Fidelización</span>
        </div>
        <div className="flex items-center gap-2">
          <RoleSwitcher />
          <button
            type="button"
            onClick={handleReset}
            title="Reiniciar datos de ejemplo"
            className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
              confirmingReset ? 'bg-rose-500 text-white' : 'bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            {confirmingReset ? '¿Confirmar?' : 'Reiniciar'}
          </button>
        </div>
      </div>

      {activeRole === 'patient' ? (
        currentPatient ? (
          <PatientShell patient={currentPatient} />
        ) : (
          <PatientAuthScreen />
        )
      ) : isAdminAuthed ? (
        <AdminShell />
      ) : (
        <AdminAuthScreen />
      )}

      <Toast />
    </div>
  )
}
