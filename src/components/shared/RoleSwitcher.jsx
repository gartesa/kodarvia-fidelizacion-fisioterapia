import { useAppData } from '../../context/AppDataContext'

export default function RoleSwitcher() {
  const { activeRole, setActiveRole } = useAppData()

  return (
    <div
      className="flex rounded-full bg-white/10 p-1 text-xs font-semibold"
      role="tablist"
      aria-label="Alternar entre vista de paciente y panel de administración"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeRole === 'patient'}
        onClick={() => setActiveRole('patient')}
        className={`rounded-full px-3 py-1.5 transition-colors ${
          activeRole === 'patient' ? 'bg-white text-primary' : 'text-white/80 hover:text-white'
        }`}
      >
        Paciente
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeRole === 'admin'}
        onClick={() => setActiveRole('admin')}
        className={`rounded-full px-3 py-1.5 transition-colors ${
          activeRole === 'admin' ? 'bg-white text-primary' : 'text-white/80 hover:text-white'
        }`}
      >
        Administración
      </button>
    </div>
  )
}
