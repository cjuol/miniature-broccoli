import { useState } from 'react'
import { useExercises } from '../catalog/useExercises'
import { ActiveExerciseCard } from './ActiveExerciseCard'
import { AddExerciseSheet } from './AddExerciseSheet'
import { SessionTimer } from './SessionTimer'
import { useFinishSessionMutation } from './useFinishSessionMutation'
import { useSession } from './useSession'
import { useStartSessionMutation } from './useStartSessionMutation'
import { useWorkoutSessionStore } from './workoutSessionStore'

const today = new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

export default function WorkoutPage() {
  const sessionId = useWorkoutSessionStore((s) => s.sessionId)
  const [addSheetOpen, setAddSheetOpen] = useState(false)
  const [confirmFinish, setConfirmFinish] = useState(false)
  const [exerciseSearch, setExerciseSearch] = useState('')

  const { data: session, isLoading, isError } = useSession()
  const { mutate: startSession, isPending: isStarting } = useStartSessionMutation()
  const { mutate: finishSession, isPending: isFinishing } = useFinishSessionMutation()
  const { data: exercises, isLoading: isLoadingExercises } = useExercises(exerciseSearch ? { search: exerciseSearch } : {})

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center px-6 pt-24">
        <p className="capitalize text-sm text-gray-500">{today}</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Entrenamiento</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          No hay ninguna sesión activa.
        </p>
        <button
          type="button"
          disabled={isStarting}
          onClick={() => startSession()}
          className="mt-8 w-full max-w-xs rounded-2xl bg-indigo-600 py-4 text-base font-semibold text-white disabled:opacity-60 active:bg-indigo-500"
        >
          {isStarting ? 'Iniciando…' : 'Empezar sesión'}
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col px-4 pt-8 pb-28">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-indigo-400">Sesión activa</p>
            <SessionTimer paused={confirmFinish} />
          </div>

          {confirmFinish ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmFinish(false)}
                className="rounded-xl bg-gray-800 px-3 py-2 text-xs text-gray-400"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isFinishing}
                onClick={() => finishSession()}
                className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                {isFinishing ? '…' : 'Terminar'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmFinish(true)}
              className="rounded-xl bg-gray-800 px-4 py-2 text-sm text-gray-400"
            >
              Terminar
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {isLoading && (
            <>
              <div className="h-28 animate-pulse rounded-xl bg-gray-900" />
              <div className="h-28 animate-pulse rounded-xl bg-gray-900" />
            </>
          )}

          {isError && (
            <p className="py-6 text-center text-sm text-red-400">
              Error al cargar la sesión. Comprueba tu conexión.
            </p>
          )}

          {session?.exerciseEntries.map((entry) => (
            <ActiveExerciseCard key={entry.id} entry={entry} />
          ))}

          {session?.exerciseEntries.length === 0 && (
            <p className="py-6 text-center text-sm text-gray-500">
              Añade un ejercicio para empezar.
            </p>
          )}
        </div>
      </div>

      {/* Botón flotante — posicionado encima del BottomNav (h-16 = 64px, añadimos margen) */}
      <div className="fixed bottom-20 inset-x-0 flex justify-center px-4">
        <button
          type="button"
          onClick={() => setAddSheetOpen(true)}
          className="rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 active:bg-indigo-500"
        >
          + Añadir ejercicio
        </button>
      </div>

      <AddExerciseSheet
        isOpen={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        exercises={exercises}
        isLoadingExercises={isLoadingExercises}
        search={exerciseSearch}
        onSearchChange={setExerciseSearch}
      />
    </>
  )
}
