import { useState } from 'react'
import { useAppData } from '../../context/AppDataContext'
import BrandMark from '../shared/BrandMark'

const CONSENT_TEXT =
  'He leído y acepto la Política de Privacidad y el Tratamiento de Datos Personales del centro para fines de fidelización y contacto. [Texto legal de marcador: Kodarvia redactará la versión definitiva de estos términos antes de producción.]'

export default function PatientAuthScreen() {
  const { patients, loginPatient, registerPatient, notify } = useAppData()
  const [mode, setMode] = useState('login')

  // --- login ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // --- registro ---
  const [form, setForm] = useState({ name: '', email: '', phone: '', sport: '', password: '' })
  const [consent, setConsent] = useState(false)
  const [registerError, setRegisterError] = useState('')

  function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    const result = loginPatient(email, password)
    if (!result.success) {
      setLoginError(result.message)
      return
    }
    notify(`¡Hola de nuevo, ${result.patient.name.split(' ')[0]}!`)
  }

  function handleRegister(e) {
    e.preventDefault()
    setRegisterError('')
    if (!form.name.trim() || !form.email.trim()) {
      setRegisterError('Nombre y correo son obligatorios.')
      return
    }
    if (form.password.length < 4) {
      setRegisterError('La clave debe tener al menos 4 caracteres.')
      return
    }
    if (!consent) {
      setRegisterError('Debes aceptar el consentimiento de privacidad para continuar.')
      return
    }
    const result = registerPatient({ ...form, consentAccepted: consent })
    if (!result.success) {
      setRegisterError(result.message)
    }
  }

  function quickFill(p) {
    setEmail(p.email)
    setPassword('demo1234')
    setLoginError('')
  }

  return (
    <div className="flex min-h-[calc(100dvh-2.75rem)] flex-col items-center justify-center bg-primary px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark size={56} />
          <h1 className="mt-4 text-xl font-bold text-white">Kodarvia Fidelización</h1>
          <p className="mt-1 text-sm text-white/70">Fisioterapia deportiva · Antofagasta</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
          <div className="mb-5 flex rounded-full bg-slate-100 p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 rounded-full py-2 transition-colors ${
                mode === 'login' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
              }`}
            >
              Ingresar
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 rounded-full py-2 transition-colors ${
                mode === 'register' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
              }`}
            >
              Registrarme
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.cl"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Clave</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  required
                />
              </div>
              {loginError && <p className="text-xs font-medium text-rose-600">{loginError}</p>}
              <button
                type="submit"
                className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 active:bg-accent-700"
              >
                Iniciar sesión
              </button>

              <div className="pt-2">
                <p className="mb-2 text-xs font-medium text-slate-400">Acceso rápido a perfiles demo</p>
                <div className="flex flex-wrap gap-1.5">
                  {patients.slice(0, 5).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => quickFill(p)}
                      className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-accent hover:text-accent-700"
                    >
                      {p.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Nombre completo</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nombre y apellido"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Correo electrónico</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="tu@correo.cl"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Clave</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  required
                  minLength={4}
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Úsala junto a tu correo para volver a entrar más adelante.
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Teléfono (opcional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+56 9 ..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Disciplina (opcional)</label>
                <input
                  type="text"
                  value={form.sport}
                  onChange={(e) => setForm((f) => ({ ...f, sport: e.target.value }))}
                  placeholder="Ej: corredor, triatleta, ciclista"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
              </div>

              <label className="flex items-start gap-2 pt-1 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-accent focus:ring-accent/40"
                />
                <span>{CONSENT_TEXT}</span>
              </label>

              {registerError && <p className="text-xs font-medium text-rose-600">{registerError}</p>}

              <button
                type="submit"
                className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 active:bg-accent-700"
              >
                Crear mi cuenta
              </button>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-[11px] text-white/50">
          Acceso simulado para fines de demostración. Sin conexión a servicios externos.
        </p>
      </div>
    </div>
  )
}
