import { durationBetween, formatDuration } from '../../utils/time'
import { useTrainingDayDetail } from './useTrainingDayDetail'

type Props = {
  date: string | null
  onClose: () => void
}

export const SessionHistorySheet = ({ date, onClose }: Props) => {
  const { data: day, isLoading } = useTrainingDayDetail(date)
  const isOpen = !!date

  const session = day?.workoutSessions[0]

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl bg-gray-900 transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-center pt-3 shrink-0">
          <div className="h-1 w-10 rounded-full bg-gray-700" />
        </div>

        <div className="shrink-0 px-5 pt-4 pb-3">
          {date && <p className="capitalize text-xs text-gray-500">{formatDate(date)}</p>}
          {session && (
            <p className="mt-0.5 font-mono text-sm text-gray-400">
              {formatDuration(durationBetween(session.startedAt, session.finishedAt))}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-10">
          {isLoading && (
            <div className="space-y-3 pt-2">
              <div className="h-24 animate-pulse rounded-xl bg-gray-800" />
              <div className="h-24 animate-pulse rounded-xl bg-gray-800" />
            </div>
          )}

          {session?.exerciseEntries.map((entry) => (
            <div key={entry.id} className="mb-3 rounded-xl bg-gray-800 p-4">
              <p className="font-semibold text-white">{entry.exercise.name}</p>

              {entry.setEntries.length === 0 && (
                <p className="mt-1 text-xs text-gray-600">Sin series registradas</p>
              )}

              <div className="mt-2 space-y-1">
                {entry.setEntries.map((set, i) => (
                  <div key={set.id} className="flex items-center gap-3">
                    <span className="w-5 text-xs text-gray-600">{i + 1}</span>
                    <span className="text-sm text-gray-300">
                      {set.weightKg} kg × {set.repsCompleted}
                    </span>
                    <span className="text-xs text-gray-500">
                      {set.toFailure ? 'al fallo' : set.rirActual !== null ? `RIR ${set.rirActual}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
