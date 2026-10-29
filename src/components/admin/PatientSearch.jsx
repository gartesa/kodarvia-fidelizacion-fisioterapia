import { useMemo, useState } from 'react'
import { useAppData } from '../../context/AppDataContext'
import LevelBadge from '../shared/LevelBadge'

export default function PatientSearch({ onSelect }) {
  const { patients, findPatientByCode } = useAppData()
  const [query, setQuery] = useState('')
  const [scanCode, setScanCode] = useState('')
  const [scanError, setScanError] = useState('')
  const [scanning, setScanning] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter(
      (p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
    )
  }, [patients, query])

  function handleScan(e) {
    e.preventDefault()
    setScanError('')
    if (!scanCode.trim()) return

    setScanning(true)
    // Pequeño delay simulado: imita la latencia de un lector óptico real.
    window.setTimeout(() => {
      const found = findPatientByCode(scanCode)
      setScanning(false)
      if (!found) {
        setScanError('No existe ningún paciente con ese código QR.')
        return
      }
      setScanCode('')
      onSelect(found.id)
    }, 350)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h3 className="text-sm font-bold text-primary">Simular lectura de código QR</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Pega o escribe el código impreso bajo el QR de la tarjeta del paciente. Kodarvia
          reemplazará esto por el lector de cámara real en producción.
        </p>
        <form onSubmit={handleScan} className="mt-3 flex gap-2">
          <input
            type="text"
            value={scanCode}
            onChange={(e) => setScanCode(e.target.value)}
            placeholder="Ej: KDV-PAT-0001"
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-mono uppercase text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="submit"
            disabled={scanning}
            className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
          >
            {scanning ? 'Leyendo…' : 'Simular escaneo'}
          </button>
        </form>
        {scanError && <p className="mt-2 text-xs font-medium text-rose-600">{scanError}</p>}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold text-primary">Buscar paciente</h3>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o correo…"
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
        />

        <div className="mt-3 space-y-2">
          {results.length === 0 && (
            <p className="rounded-lg bg-white px-3 py-4 text-center text-xs text-slate-400 ring-1 ring-slate-100">
              No hay pacientes que coincidan con tu búsqueda.
            </p>
          )}
          {results.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className="flex w-full items-center justify-between gap-3 rounded-xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-100 transition-colors hover:ring-accent/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-primary">{p.name}</p>
                <p className="truncate text-xs text-slate-400">{p.email}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-primary">{p.points} pts</p>
                <LevelBadge points={p.points} size="sm" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
