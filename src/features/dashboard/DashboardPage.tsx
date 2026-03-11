import { useMemo, useState } from 'react'
import { useAuthStore } from '../auth/authStore'
import { SessionHistorySheet } from './SessionHistorySheet'
import { StatCard } from './StatCard'
import { TrainingDayCard } from './TrainingDayCard'
import { useTrainingDays } from './useTrainingDays'

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const now = new Date()

  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const { data: trainingDays, isLoading, isError } = useTrainingDays({ year, month })

  const prevMonth = () => {
    if (month === 1) { setYear((y) => y - 1); setMonth(12) }
    else setMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setYear((y) => y + 1); setMonth(1) }
    else setMonth((m) => m + 1)
  }

  // Métricas calculadas en cliente a partir de los datos ya cargados — sin llamadas extra
  const { totalDays, totalSets } = useMemo(() => {
    if (!trainingDays) return { totalDays: 0, totalSets: 0 }
    const days = trainingDays.length
    const sets = trainingDays.reduce(
      (acc, day) =>
        acc +
        day.workoutSessions.reduce(
          (sAcc, s) => sAcc + (s.exerciseEntries ?? []).reduce((eAcc, e) => eAcc + e.setEntries.length, 0),
          0,
        ),
      0,
    )
    return { totalDays: days, totalSets: sets }
  }, [trainingDays])

  const sortedDays = useMemo(
    () => [...(trainingDays ?? [])].sort((a, b) => b.date.localeCompare(a.date)),
    [trainingDays],
  )

  const greeting = user?.email ? `Hola, ${user.email.split('@')[0]}` : 'Inicio'

  return (
    <>
      <div className="flex flex-col gap-4 px-4 pt-8 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{greeting}</h1>
        </div>

        {/* Selector de mes */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-gray-400 active:bg-gray-700"
          >
            ‹
          </button>
          <span className="text-sm font-medium text-gray-300">
            {MONTH_NAMES[month - 1]} {year}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-gray-400 active:bg-gray-700"
          >
            ›
          </button>
        </div>

        {/* Tarjetas de métricas */}
        {!isLoading && (
          <div className="flex gap-3">
            <StatCard value={totalDays} label="Días entrenados" />
            <StatCard value={totalSets} label="Series totales" />
          </div>
        )}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-1 h-20 animate-pulse rounded-xl bg-gray-900" />
            <div className="flex-1 h-20 animate-pulse rounded-xl bg-gray-900" />
          </div>
        )}

        {/* Lista de días de entrenamiento */}
        <div className="flex flex-col gap-2">
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-900" />
          ))}

          {isError && (
            <p className="py-6 text-center text-sm text-red-400">
              Error al cargar el historial. Inténtalo de nuevo.
            </p>
          )}

          {!isLoading && sortedDays.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500">
              Sin entrenamientos este mes.
            </p>
          )}

          {sortedDays.map((day) => (
            <TrainingDayCard
              key={day.id}
              day={day}
              onClick={setSelectedDate}
            />
          ))}
        </div>
      </div>

      <SessionHistorySheet
        date={selectedDate}
        onClose={() => setSelectedDate(null)}
      />
    </>
  )
}
