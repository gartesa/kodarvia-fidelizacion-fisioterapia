import { QRCodeSVG } from 'qrcode.react'
import { getLevelProgress } from '../../utils/levels'
import { formatDate } from '../../utils/date'
import LevelBadge from '../shared/LevelBadge'

export default function LoyaltyCard({ patient }) {
  const { current, next, percent, pointsToNext } = getLevelProgress(patient.points)

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl bg-primary p-5 text-white shadow-card sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/60">
              Tarjeta digital de fidelización
            </p>
            <h2 className="mt-1 text-lg font-bold leading-tight sm:text-xl">{patient.name}</h2>
            <p className="mt-0.5 text-xs text-white/60">{patient.sport}</p>
          </div>
          <LevelBadge points={patient.points} size="sm" />
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/60">Puntos acumulados</p>
            <p className="text-4xl font-extrabold tabular-nums sm:text-5xl">{patient.points}</p>
          </div>
          <div className="shrink-0 rounded-xl bg-white p-2">
            <QRCodeSVG value={patient.qrId} size={84} fgColor="#0F2942" bgColor="#FFFFFF" level="M" />
          </div>
        </div>

        <div className="mt-5">
          {next ? (
            <>
              <div className="flex items-center justify-between text-[11px] text-white/70">
                <span>Nivel {current.label}</span>
                <span>Nivel {next.label}</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-white/60">
                Te faltan <span className="font-semibold text-white">{pointsToNext} pts</span> para
                alcanzar el nivel {next.label}.
              </p>
            </>
          ) : (
            <>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-full rounded-full bg-accent" />
              </div>
              <p className="mt-1.5 text-[11px] text-white/60">
                Alcanzaste el nivel máximo de fidelización. ¡Gracias por tu constancia!
              </p>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Código de tarjeta</p>
          <p className="mt-1 font-mono text-sm font-semibold text-primary">{patient.qrId}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Paciente desde</p>
          <p className="mt-1 text-sm font-semibold text-primary">{formatDate(patient.joinedAt)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-4 text-xs text-slate-500">
        Muestra este código QR en recepción para que el equipo acredite tus puntos tras cada sesión.
        El lector de cámara real lo integrará Kodarvia en producción; aquí el personal simula la
        lectura desde el panel de administración.
      </div>
    </div>
  )
}
