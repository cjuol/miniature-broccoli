import { useEffect, useState } from 'react'
import { formatDuration } from '../../utils/time'
import { useWorkoutSessionStore } from './workoutSessionStore'

type SessionTimerProps = {
  paused?: boolean
}

export const SessionTimer = ({ paused = false }: SessionTimerProps) => {
  const startedAt = useWorkoutSessionStore((s) => s.startedAt)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startedAt) return

    if (paused) {
      // Congelamos el valor visible al entrar en confirmación de cierre para evitar errores de UX.
      setElapsed(Math.floor((Date.now() - startedAt) / 1000))
      return
    }

    // Calculamos el tiempo ya transcurrido al montar el componente (por si venimos de otra pestaña)
    setElapsed(Math.floor((Date.now() - startedAt) / 1000))

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startedAt, paused])

  return (
    <span className="font-mono text-2xl font-bold tabular-nums text-white">
      {formatDuration(elapsed)}
    </span>
  )
}
