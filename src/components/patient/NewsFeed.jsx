import { useAppData } from '../../context/AppDataContext'
import { formatDate, relativeFromNow } from '../../utils/date'

const BADGE_STYLES = {
  Taller: 'bg-accent-50 text-accent-700',
  Promoción: 'bg-primary-50 text-primary-600',
  Novedad: 'bg-slate-100 text-slate-600',
  Consejo: 'bg-amber-50 text-amber-700',
  Catálogo: 'bg-violet-50 text-violet-700',
}

export default function NewsFeed({ patient }) {
  const { news, markNewsRead } = useAppData()
  const sorted = [...news].sort((a, b) => new Date(b.date) - new Date(a.date))
  const unreadCount = sorted.filter((n) => !n.readBy.includes(patient.id)).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-primary">Novedades del centro</h2>
          <p className="text-xs text-slate-500">
            {unreadCount > 0 ? `${unreadCount} aviso${unreadCount > 1 ? 's' : ''} sin leer` : 'Estás al día'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((item) => {
          const isRead = item.readBy.includes(patient.id)
          return (
            <article
              key={item.id}
              className={`rounded-2xl bg-white p-4 shadow-sm ring-1 transition-colors ${
                isRead ? 'ring-slate-100' : 'ring-accent/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    BADGE_STYLES[item.badge] ?? 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
                {!isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
              </div>

              <h3 className="mt-2 text-sm font-semibold text-primary">{item.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.body}</p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-400" title={formatDate(item.date)}>
                  {relativeFromNow(item.date)}
                </span>
                {!isRead && (
                  <button
                    type="button"
                    onClick={() => markNewsRead(item.id, patient.id)}
                    className="text-[11px] font-semibold text-accent-700 hover:underline"
                  >
                    Marcar como leído
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
