import { getLevelForPoints } from '../../utils/levels'

export default function LevelBadge({ points, size = 'md' }) {
  const level = getLevelForPoints(points)
  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide uppercase ${sizes[size]}`}
      style={{ color: level.color, backgroundColor: level.bg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: level.color }} />
      Nivel {level.label}
    </span>
  )
}
