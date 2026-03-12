import { durationBetween, formatDuration } from '../../utils/time'
import type { TrainingDaySummary } from './types'

type Props = {
  day: TrainingDaySummary
  onClick: (date: string) => void
}

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export const TrainingDayCard = ({ day, onClick }: Props) => {
  // Usamos la primera sesión del día para mostrar los datos de resumen
  const session = day.workoutSessions[0]
  if (!session) return null

  const exerciseCount = session.exerciseEntries.length
  const duration = durationBetween(session.startedAt, session.finishedAt)
  const isOngoing = !session.finishedAt

  return (
    <button
      type="button"
      onClick={() => onClick(day.date)}
      className="flex w-full items-center justify-between rounded-xl bg-gray-900 px-4 py-3.5 text-left active:bg-gray-800"
    >
      <div>
        <p className="font-semibold capitalize text-white">{formatDate(day.date)}</p>
        <p className="mt-0.5 text-xs text-gray-500">
          {exerciseCount} {exerciseCount === 1 ? 'ejercicio' : 'ejercicios'}
        </p>
      </div>

      <span className={`font-mono text-sm ${isOngoing ? 'text-indigo-400' : 'text-gray-400'}`}>
        {isOngoing ? 'En curso' : formatDuration(duration)}
      </span>
    </button>
  )
}
