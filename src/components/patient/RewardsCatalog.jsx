import { useMemo, useState } from 'react'
import { useAppData } from '../../context/AppDataContext'

export default function RewardsCatalog({ patient }) {
  const { rewards, redeemReward } = useAppData()
  const [confirmingId, setConfirmingId] = useState(null)

  const categories = useMemo(
    () => ['Todos', ...new Set(rewards.map((r) => r.category))],
    [rewards]
  )
  const [activeCategory, setActiveCategory] = useState('Todos')

  const visibleRewards = useMemo(
    () =>
      activeCategory === 'Todos' ? rewards : rewards.filter((r) => r.category === activeCategory),
    [rewards, activeCategory]
  )

  function handleRedeem(reward) {
    if (confirmingId !== reward.id) {
      setConfirmingId(reward.id)
      return
    }
    redeemReward(patient.id, reward.id, { by: 'paciente' })
    setConfirmingId(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-primary">Catálogo de premios</h2>
        <p className="text-xs text-slate-500">
          Tienes <span className="font-semibold text-primary">{patient.points} pts</span> disponibles
          para canjear.
        </p>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-white'
                : 'bg-white text-slate-500 ring-1 ring-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visibleRewards.map((reward) => {
          const affordable = patient.points >= reward.pointsCost
          const isConfirming = confirmingId === reward.id

          return (
            <div
              key={reward.id}
              className="flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-600">
                  {reward.category}
                </span>
                <span
                  className={`whitespace-nowrap text-sm font-bold ${
                    affordable ? 'text-accent-700' : 'text-slate-400'
                  }`}
                >
                  {reward.pointsCost} pts
                </span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-primary">{reward.name}</h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-500">{reward.description}</p>

              <button
                type="button"
                disabled={!affordable}
                onClick={() => handleRedeem(reward)}
                onBlur={() => isConfirming && setConfirmingId(null)}
                className={`mt-3 w-full rounded-lg py-2 text-xs font-semibold transition-colors ${
                  !affordable
                    ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                    : isConfirming
                    ? 'bg-accent-700 text-white'
                    : 'bg-accent text-white hover:bg-accent-600 active:bg-accent-700'
                }`}
              >
                {!affordable
                  ? 'Puntos insuficientes'
                  : isConfirming
                  ? 'Confirmar canje'
                  : 'Canjear premio'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
