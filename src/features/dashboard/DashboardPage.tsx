import { useMemo, useState } from 'react'
import { useAuthStore } from '../auth/authStore'
import { SessionHistorySheet } from './SessionHistorySheet'
import { StatCard } from './StatCard'
import { TrainingDayCard } from './TrainingDayCard'
import { usePersonalRecords } from './usePersonalRecords'
import { useTrainingDays } from './useTrainingDays'
import { useVolumeMetrics } from './useVolumeMetrics'

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

  // Rango del mes seleccionado para el endpoint de volumen
  const from = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const to = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const { data: volumeData } = useVolumeMetrics(from, to)
  const { data: prData } = usePersonalRecords()

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

  // Volumen total del mes en toneladas — calculado desde el endpoint de métricas
  const totalVolumeLabel = useMemo(() => {
    if (!volumeData?.muscles.length) return null
    const kg = volumeData.muscles.reduce((acc, m) => acc + m.volume, 0)
    return `${(kg / 1000).toFixed(1)} t`
  }, [volumeData])

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
            <StatCard value={totalDays} label="Días" />
            <StatCard value={totalSets} label="Series" />
            {totalVolumeLabel && (
              <StatCard value={totalVolumeLabel} label="Volumen" />
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-1 h-20 animate-pulse rounded-xl bg-gray-900" />
            <div className="flex-1 h-20 animate-pulse rounded-xl bg-gray-900" />
          </div>
        )}

        {/* Récords personales — no dependen del mes seleccionado */}
        {prData && prData.personalRecords.length > 0 && (
          <div>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Récords personales
            </h2>
            <div className="rounded-xl bg-gray-900 divide-y divide-gray-800">
              {prData.personalRecords.slice(0, 8).map((pr) => (
                <div
                  key={pr.exerciseName}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <span className="text-sm text-white">{pr.exerciseName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-indigo-400">
                      {pr.maxWeight} kg
                    </span>
                    <span className="text-xs text-gray-600">
                      {new Date(pr.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
