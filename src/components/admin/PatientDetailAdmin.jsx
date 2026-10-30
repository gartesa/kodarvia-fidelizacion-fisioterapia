import { useRef, useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import 'react-phone-number-input/style.css'
import { useAppData } from '../../context/AppDataContext'
import { getLevelProgress } from '../../utils/levels'
import { formatDateTime } from '../../utils/date'
import { EMAIL_REGEX } from '../../utils/validation'
import LevelBadge from '../shared/LevelBadge'

const POINT_PRESETS = [
  { points: 50, label: '+50 (bono)' },
  { points: 80, label: '+80 (sesión)' },
  { points: 100, label: '+100 (sesión extendida)' },
]

// Bloquea reenvíos mientras el usuario mantiene el dedo/click sobre el botón:
// sin esto, clics repetidos en rápida sucesión (doble clic, mashing) generaban
// una entrada de historial duplicada por cada clic.
const SUBMIT_COOLDOWN_MS = 600

export default function PatientDetailAdmin({ patient, onBack }) {
  const { accreditPoints, redeemReward, updatePatient, deletePatient, rewards, history } =
    useAppData()

  const [points, setPoints] = useState(80)
  const [description, setDescription] = useState('Sesión de kinesiología deportiva')
  const [lastUpdateMs, setLastUpdateMs] = useState(null)
  const [isAccrediting, setIsAccrediting] = useState(false)
  const accreditLockRef = useRef(false)

  const [rewardId, setRewardId] = useState(rewards[0]?.id ?? '')
  const [redeemError, setRedeemError] = useState('')
  const [redeemOk, setRedeemOk] = useState('')
  const [isRedeeming, setIsRedeeming] = useState(false)
  const redeemLockRef = useRef(false)

  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    sport: patient.sport,
  })
  const [editError, setEditError] = useState('')
  const [editOk, setEditOk] = useState('')

  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const patientHistory = history.filter((h) => h.patientId === patient.id).slice(0, 8)
  const selectedReward = rewards.find((r) => r.id === rewardId)
  const canRedeem = selectedReward ? patient.points >= selectedReward.pointsCost : false

  function handleAccredit(e) {
    e.preventDefault()
    if (accreditLockRef.current) return
    accreditLockRef.current = true
    setIsAccrediting(true)

    const start = performance.now()
    const result = accreditPoints(patient.id, Number(points), description)
    if (result.success) {
      setLastUpdateMs(Math.round(performance.now() - start))
    }

    window.setTimeout(() => {
      accreditLockRef.current = false
      setIsAccrediting(false)
    }, SUBMIT_COOLDOWN_MS)
  }

  function handleRedeem(e) {
    e.preventDefault()
    if (redeemLockRef.current) return
    redeemLockRef.current = true
    setIsRedeeming(true)

    setRedeemError('')
    setRedeemOk('')
    if (!selectedReward) {
      redeemLockRef.current = false
      setIsRedeeming(false)
      return
    }
    const result = redeemReward(patient.id, selectedReward.id, { by: 'admin' })
    if (!result.success) {
      setRedeemError(result.message)
    } else {
      setRedeemOk(`Canje registrado: ${selectedReward.name}.`)
    }

    window.setTimeout(() => {
      redeemLockRef.current = false
      setIsRedeeming(false)
    }, SUBMIT_COOLDOWN_MS)
  }

  function startEditing() {
    setEditForm({ name: patient.name, email: patient.email, phone: patient.phone, sport: patient.sport })
    setEditError('')
    setEditOk('')
    setEditing(true)
  }

  function handleEditSave(e) {
    e.preventDefault()
    setEditError('')
    setEditOk('')
    const nameWords = editForm.name.trim().split(/\s+/).filter(Boolean)
    if (nameWords.length < 2) {
      setEditError('Ingresa el nombre completo (nombre y apellido).')
      return
    }
    if (!EMAIL_REGEX.test(editForm.email.trim())) {
      setEditError('Ingresa un correo electrónico válido (ej. usuario@dominio.cl).')
      return
    }
    const result = updatePatient(patient.id, editForm)
    if (!result.success) {
      setEditError(result.message)
      return
    }
    setEditOk('Datos actualizados correctamente.')
    setEditing(false)
  }

  function handleDeleteConfirmed() {
    setDeleteError('')
    const result = deletePatient(patient.id)
    if (!result.success) {
      setDeleteError(result.message)
      return
    }
    onBack()
  }

  const { current, next, percent } = getLevelProgress(patient.points)

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="text-xs font-semibold text-slate-500 hover:text-primary"
      >
        ← Volver a la búsqueda
      </button>

      <div className="rounded-2xl bg-primary p-4 text-white shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold">{patient.name}</h3>
            <p className="text-xs text-white/60">{patient.email}</p>
            <p className="mt-0.5 font-mono text-[11px] text-white/50">{patient.qrId}</p>
          </div>
          <LevelBadge points={patient.points} size="sm" />
        </div>
        <div className="mt-4 flex items-end justify-between">
          <p className="text-3xl font-extrabold tabular-nums">{patient.points} pts</p>
          <p className="text-[11px] text-white/60">
            {next ? `${current.label} → ${next.label}` : 'Nivel máximo alcanzado'}
          </p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-primary">Datos del paciente</h4>
          {!editing && (
            <button
              type="button"
              onClick={startEditing}
              className="text-xs font-semibold text-accent-700 hover:text-accent"
            >
              Editar datos
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleEditSave} className="mt-3 space-y-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-500">Nombre completo</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-500">Correo electrónico</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-500">Teléfono (opcional)</label>
              <PhoneInput
                flags={flags}
                defaultCountry="CL"
                international
                value={editForm.phone}
                onChange={(value) => setEditForm((f) => ({ ...f, phone: value || '' }))}
                placeholder="+56 9 1234 5678"
                className="kodarvia-phone-input"
                numberInputProps={{ className: 'kodarvia-phone-input-field' }}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-500">Disciplina (opcional)</label>
              <input
                type="text"
                value={editForm.sport}
                onChange={(e) => setEditForm((f) => ({ ...f, sport: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {editError && <p className="text-xs font-medium text-rose-600">{editError}</p>}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 active:bg-accent-700"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setEditError('')
                }}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-500 ring-1 ring-slate-200 hover:text-primary"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-3 space-y-1 text-xs text-slate-500">
            <p>Teléfono: {patient.phone || 'Sin registrar'}</p>
            <p>Disciplina: {patient.sport}</p>
            {editOk && <p className="font-medium text-accent-700">{editOk}</p>}
          </div>
        )}
      </div>

      <form onSubmit={handleAccredit} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h4 className="text-sm font-bold text-primary">Acreditar puntos por sesión</h4>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {POINT_PRESETS.map((preset) => (
            <button
              key={preset.points}
              type="button"
              onClick={() => setPoints(preset.points)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                points === preset.points
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-[100px_1fr] gap-2">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-500">Puntos</label>
            <input
              type="number"
              min={1}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-500">Motivo / sesión</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isAccrediting}
          className={`mt-3 w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors ${
            isAccrediting
              ? 'cursor-not-allowed bg-accent/60'
              : 'bg-accent hover:bg-accent-600 active:bg-accent-700'
          }`}
        >
          {isAccrediting ? 'Acreditando…' : 'Acreditar puntos'}
        </button>

        {lastUpdateMs !== null && (
          <p className="mt-2 text-center text-[11px] font-medium text-accent-700">
            ✓ Saldo e historial actualizados en {lastUpdateMs} ms
          </p>
        )}
      </form>

      <form onSubmit={handleRedeem} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h4 className="text-sm font-bold text-primary">Registrar canje de premio</h4>
        <select
          value={rewardId}
          onChange={(e) => {
            setRewardId(e.target.value)
            setRedeemError('')
            setRedeemOk('')
          }}
          className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
        >
          {rewards.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} — {r.pointsCost} pts
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!canRedeem || isRedeeming}
          className={`mt-3 w-full rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            canRedeem && !isRedeeming
              ? 'bg-primary text-white hover:bg-primary-700'
              : 'cursor-not-allowed bg-slate-100 text-slate-400'
          }`}
        >
          {isRedeeming ? 'Registrando…' : canRedeem ? 'Registrar canje' : 'Puntos insuficientes para este canje'}
        </button>

        {redeemError && <p className="mt-2 text-xs font-medium text-rose-600">{redeemError}</p>}
        {redeemOk && <p className="mt-2 text-xs font-medium text-accent-700">{redeemOk}</p>}
      </form>

      <div>
        <h4 className="mb-2 text-sm font-bold text-primary">Historial reciente</h4>
        <div className="space-y-2">
          {patientHistory.length === 0 && (
            <p className="rounded-lg bg-white px-3 py-4 text-center text-xs text-slate-400 ring-1 ring-slate-100">
              Este paciente aún no tiene movimientos.
            </p>
          )}
          {patientHistory.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-100"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-primary">{h.description}</p>
                <p className="text-[11px] text-slate-400">{formatDateTime(h.date)}</p>
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

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-rose-100">
        <h4 className="text-sm font-bold text-rose-700">Zona de riesgo</h4>
        {!confirmingDelete ? (
          <>
            <p className="mt-1 text-xs text-slate-500">
              Elimina a este paciente de forma permanente, incluyendo su perfil guardado localmente.
            </p>
            <button
              type="button"
              onClick={() => {
                setDeleteError('')
                setConfirmingDelete(true)
              }}
              className="mt-3 w-full rounded-lg border border-rose-200 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50"
            >
              Eliminar paciente
            </button>
          </>
        ) : (
          <>
            <p className="mt-1 text-xs font-medium text-rose-700">
              ¿Seguro que quieres eliminar a {patient.name}? Esta acción no se puede deshacer.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                className="flex-1 rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
              >
                Sí, eliminar
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-500 ring-1 ring-slate-200 hover:text-primary"
              >
                Cancelar
              </button>
            </div>
            {deleteError && <p className="mt-2 text-xs font-medium text-rose-600">{deleteError}</p>}
          </>
        )}
      </div>
    </div>
  )
}
