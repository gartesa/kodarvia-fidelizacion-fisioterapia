import { useState } from 'react'
import { useAppData } from '../../context/AppDataContext'
import { formatDateTime } from '../../utils/date'

const BADGES = ['Novedad', 'Promoción', 'Taller', 'Consejo', 'Catálogo']

export default function NewsComposer() {
  const { news, addNews } = useAppData()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [badge, setBadge] = useState('Novedad')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    addNews({ title, body, badge })
    setTitle('')
    setBody('')
    setBadge('Novedad')
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h3 className="text-sm font-bold text-primary">Nueva publicación</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Aparece de inmediato en el feed de novedades de todos los pacientes.
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {BADGES.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBadge(b)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                badge === b ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-[11px] font-medium text-slate-500">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Taller de prevención de lesiones de tobillo"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            required
          />
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-[11px] font-medium text-slate-500">Contenido</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Describe la promoción, taller o consejo para tus pacientes…"
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-3 w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 active:bg-accent-700"
        >
          Publicar en el feed
        </button>
      </form>

      <div>
        <h4 className="mb-2 text-sm font-bold text-primary">Publicaciones existentes</h4>
        <div className="space-y-2">
          {news.map((item) => (
            <NewsItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function NewsItem({ item }) {
  const { updateNews, deleteNews } = useAppData()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: item.title, body: item.body, badge: item.badge })
  const [error, setError] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  function startEditing() {
    setForm({ title: item.title, body: item.body, badge: item.badge })
    setError('')
    setEditing(true)
  }

  function handleSave(e) {
    e.preventDefault()
    setError('')
    const result = updateNews(item.id, form)
    if (!result.success) {
      setError(result.message)
      return
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} className="space-y-2 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-wrap gap-1.5">
          {BADGES.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setForm((f) => ({ ...f, badge: b }))}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                form.badge === b ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          required
        />
        <textarea
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          required
        />
        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-accent py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-600"
          >
            Guardar cambios
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false)
              setError('')
            }}
            className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 ring-1 ring-slate-200 hover:text-primary"
          >
            Cancelar
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-600">
          {item.badge}
        </span>
        <span className="text-[11px] text-slate-400">{formatDateTime(item.date)}</span>
      </div>
      <p className="mt-1.5 text-xs font-semibold text-primary">{item.title}</p>
      <p className="mt-1 truncate text-[11px] text-slate-500">{item.body}</p>
      <p className="mt-1 text-[11px] text-slate-500">
        Leído por {item.readBy.length} paciente{item.readBy.length === 1 ? '' : 's'}
      </p>

      {confirmingDelete ? (
        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-rose-50 px-2.5 py-2">
          <span className="text-[11px] font-medium text-rose-700">¿Eliminar esta publicación?</span>
          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              onClick={() => deleteNews(item.id)}
              className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-rose-700"
            >
              Sí, eliminar
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200 hover:text-primary"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={startEditing}
            className="text-[11px] font-semibold text-accent-700 hover:text-accent"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  )
}
