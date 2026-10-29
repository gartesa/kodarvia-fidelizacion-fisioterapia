import { useState } from 'react'
import { useAppData } from '../../context/AppDataContext'
import { ADMIN_DEMO_CREDENTIALS } from '../../data/constants'
import BrandMark from '../shared/BrandMark'

export default function AdminAuthScreen() {
  const { adminLogin } = useAppData()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const ok = adminLogin(user.trim(), pass)
    if (!ok) setError('Credenciales incorrectas. Revisa el dato de ejemplo debajo del formulario.')
  }

  return (
    <div className="flex min-h-[calc(100dvh-2.75rem)] flex-col items-center justify-center bg-primary px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark size={56} />
          <h1 className="mt-4 text-xl font-bold text-white">Panel de administración</h1>
          <p className="mt-1 text-sm text-white/70">Acceso exclusivo para el equipo del centro</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl bg-white p-5 shadow-card sm:p-6">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Usuario</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="admin"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Clave</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
              required
            />
          </div>

          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 active:bg-accent-700"
          >
            Entrar al panel
          </button>

          <p className="rounded-lg bg-slate-50 px-3 py-2 text-center text-[11px] text-slate-500">
            Acceso de demostración: <span className="font-mono font-semibold">{ADMIN_DEMO_CREDENTIALS.user}</span> /{' '}
            <span className="font-mono font-semibold">{ADMIN_DEMO_CREDENTIALS.pass}</span>
          </p>
        </form>
      </div>
    </div>
  )
}
