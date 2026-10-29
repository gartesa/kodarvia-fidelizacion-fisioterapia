import { useEffect } from 'react'
import { useAppData } from '../../context/AppDataContext'

export default function Toast() {
  const { toast, setToast } = useAppData()

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(timer)
  }, [toast, setToast])

  if (!toast) return null

  const toneClasses =
    toast.tone === 'error'
      ? 'bg-rose-600 text-white'
      : 'bg-primary text-white'

  return (
    <div
      className="fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 sm:bottom-6"
      role="status"
      aria-live="polite"
    >
      <div
        key={toast.key}
        className={`max-w-sm rounded-xl px-4 py-3 text-sm font-medium shadow-card animate-[fadeIn_0.2s_ease-out] ${toneClasses}`}
      >
        {toast.message}
      </div>
    </div>
  )
}
