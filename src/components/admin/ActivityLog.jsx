import { useMemo, useState } from 'react'
import { useAppData } from '../../context/AppDataContext'
import { formatDateTime } from '../../utils/date'

export default function ActivityLog() {
  const { history, exportHistoryCsv } = useAppData()
  const [filter, setFilter] = useState('todos')

  const sorted = useMemo(() => [...history].sort((a, b) => new Date(b.date) - new Date(a.date)), [history])
  const filtered = useMemo(
    () => (filter === 'todos' ? sorted : sorted.filter((h) => h.type === filter)),
    [sorted, filter]
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-primary">Actividad del programa</h3>
          <p className="text-xs text-slate-500">{filtered.length} movimientos registrados</p>
        </div>
        <button
          type="button"
          onClick={() => exportHistoryCsv(filtered)}
          className="shrink-0 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-700"
        >
          Exportar CSV
        </button>
      </div>

      <div className="flex gap-2">
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'acreditacion', label: 'Acreditaciones' },
          { key: 'canje', label: 'Canjes' },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === f.key ? 'bg-primary text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="rounded-lg bg-white px-3 py-6 text-center text-xs text-slate-400 ring-1 ring-slate-100">
            No hay movimientos para este filtro.
          </p>
        )}
        {filtered.map((h) => (
          <div
            key={h.id}
            className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-100"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-primary">{h.patientName}</p>
              <p className="truncate text-[11px] text-slate-500">{h.description}</p>
              <p className="text-[10px] text-slate-400">{formatDateTime(h.date)}</p>
            </div>
            <span
              className={`shrink-0 text-sm font-bold tabular-nums ${
                h.points > 0 ? 'text-accent-700' : 'text-rose-600'
              }`}
            >
              {h.points > 0 ? '+' : ''}
              {h.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
