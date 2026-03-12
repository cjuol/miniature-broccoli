import { useEffect, useState } from 'react'
import { formatDuration } from '../../utils/time'
import { useWorkoutSessionStore } from './workoutSessionStore'

export const SessionTimer = () => {
  const startedAt = useWorkoutSessionStore((s) => s.startedAt)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startedAt) return

    // Calculamos el tiempo ya transcurrido al montar el componente (por si venimos de otra pestaña)
    setElapsed(Math.floor((Date.now() - startedAt) / 1000))

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startedAt])

  return (
    <span className="font-mono text-2xl font-bold tabular-nums text-white">
      {formatDuration(elapsed)}
    </span>
  )
}
