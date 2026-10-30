import { useState } from 'react'
import { useAppData } from '../../context/AppDataContext'
import { REWARD_CATEGORIES } from '../../data/constants'

const EMPTY_FORM = { name: '', category: REWARD_CATEGORIES[0], pointsCost: 100, description: '' }

export default function RewardsManager() {
  const { rewards, addReward } = useAppData()
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const result = addReward(form)
    if (!result.success) {
      setError(result.message)
      return
    }
    setForm(EMPTY_FORM)
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h3 className="text-sm font-bold text-primary">Nuevo premio</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Aparece de inmediato en el catálogo del paciente y en el selector de canjes.
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {REWARD_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setForm((f) => ({ ...f, category: cat }))}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                form.category === cat ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-[11px] font-medium text-slate-500">Nombre</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ej: Sesión de electroestimulación"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            required
          />
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-[11px] font-medium text-slate-500">Puntos requeridos</label>
          <input
            type="number"
            min={1}
            value={form.pointsCost}
            onChange={(e) => setForm((f) => ({ ...f, pointsCost: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            required
          />
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-[11px] font-medium text-slate-500">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            placeholder="Describe en qué consiste el premio…"
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            required
          />
        </div>

        {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}

        <button
          type="submit"
          className="mt-3 w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 active:bg-accent-700"
        >
          Agregar al catálogo
        </button>
      </form>

      <div>
        <h4 className="mb-2 text-sm font-bold text-primary">Premios del catálogo</h4>
        <div className="space-y-2">
          {rewards.length === 0 && (
            <p className="rounded-lg bg-white px-3 py-4 text-center text-xs text-slate-400 ring-1 ring-slate-100">
              Todavía no hay premios en el catálogo.
            </p>
          )}
          {rewards.map((reward) => (
            <RewardItem key={reward.id} reward={reward} />
          ))}
        </div>
      </div>
    </div>
  )
}

function RewardItem({ reward }) {
  const { updateReward, deleteReward } = useAppData()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: reward.name,
    category: reward.category,
    pointsCost: reward.pointsCost,
    description: reward.description,
  })
  const [error, setError] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  function startEditing() {
    setForm({
      name: reward.name,
      category: reward.category,
      pointsCost: reward.pointsCost,
      description: reward.description,
    })
    setError('')
    setEditing(true)
  }

  function handleSave(e) {
    e.preventDefault()
    setError('')
    const result = updateReward(reward.id, form)
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
          {REWARD_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setForm((f) => ({ ...f, category: cat }))}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                form.category === cat ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          required
        />
        <input
          type="number"
          min={1}
          value={form.pointsCost}
          onChange={(e) => setForm((f) => ({ ...f, pointsCost: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={2}
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
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-600">
          {reward.category}
        </span>
        <span className="shrink-0 text-xs font-bold text-accent-700">{reward.pointsCost} pts</span>
      </div>
      <p className="mt-1.5 text-xs font-semibold text-primary">{reward.name}</p>
      <p className="mt-1 truncate text-[11px] text-slate-500">{reward.description}</p>

      {confirmingDelete ? (
        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-rose-50 px-2.5 py-2">
          <span className="text-[11px] font-medium text-rose-700">¿Eliminar este premio?</span>
          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              onClick={() => deleteReward(reward.id)}
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
