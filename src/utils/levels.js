import { LEVELS } from '../data/constants'

export function getLevelForPoints(points) {
  let current = LEVELS[0]
  for (const level of LEVELS) {
    if (points >= level.min) current = level
  }
  return current
}

export function getLevelProgress(points) {
  const current = getLevelForPoints(points)
  const index = LEVELS.findIndex((l) => l.key === current.key)
  const next = LEVELS[index + 1] ?? null

  if (!next) {
    return { current, next: null, percent: 100, pointsToNext: 0 }
  }

  const span = next.min - current.min
  const progressed = points - current.min
  const percent = Math.max(0, Math.min(100, Math.round((progressed / span) * 100)))
  const pointsToNext = Math.max(0, next.min - points)

  return { current, next, percent, pointsToNext }
}
