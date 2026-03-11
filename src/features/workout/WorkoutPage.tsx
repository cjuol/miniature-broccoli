import { useState } from 'react'
import { ActiveExerciseCard } from './ActiveExerciseCard'
import { AddBlockSheet } from './AddBlockSheet'
import { AddExerciseSheet } from './AddExerciseSheet'
import { CardioEntryCard } from './CardioEntryCard'
import { LogCardioSheet } from './LogCardioSheet'
import { LogMetabolicSheet } from './LogMetabolicSheet'
import { MetabolicEntryCard } from './MetabolicEntryCard'
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
  const [addBlockOpen, setAddBlockOpen] = useState(false)
  const [addExerciseOpen, setAddExerciseOpen] = useState(false)
  const [addCardioOpen, setAddCardioOpen] = useState(false)
  const [addMetabolicOpen, setAddMetabolicOpen] = useState(false)
  const [confirmFinish, setConfirmFinish] = useState(false)

  const { data: session, isLoading, isError } = useSession()
  const { mutate: startSession, isPending: isStarting } = useStartSessionMutation()
  const { mutate: finishSession, isPending: isFinishing } = useFinishSessionMutation()

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

  const isEmpty =
    !isLoading &&
    session?.exerciseEntries.length === 0 &&
    session?.cardioEntries.length === 0 &&
    session?.metabolicEntries.length === 0

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

          {session?.cardioEntries.map((entry) => (
            <CardioEntryCard key={entry.id} entry={entry} />
          ))}

          {session?.metabolicEntries.map((entry) => (
            <MetabolicEntryCard key={entry.id} entry={entry} />
          ))}

          {isEmpty && (
            <p className="py-6 text-center text-sm text-gray-500">
              Añade un bloque para empezar.
            </p>
          )}
        </div>
      </div>

      {/* Botón flotante — posicionado encima del BottomNav */}
      <div className="fixed bottom-20 inset-x-0 flex justify-center px-4">
        <button
          type="button"
          onClick={() => setAddBlockOpen(true)}
          className="rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 active:bg-indigo-500"
        >
          + Añadir bloque
        </button>
      </div>

      <AddBlockSheet
        isOpen={addBlockOpen}
        onClose={() => setAddBlockOpen(false)}
        onSelectStrength={() => setAddExerciseOpen(true)}
        onSelectCardio={() => setAddCardioOpen(true)}
        onSelectMetabolic={() => setAddMetabolicOpen(true)}
      />

      <AddExerciseSheet
        isOpen={addExerciseOpen}
        onClose={() => setAddExerciseOpen(false)}
      />

      <LogCardioSheet
        isOpen={addCardioOpen}
        onClose={() => setAddCardioOpen(false)}
      />

      <LogMetabolicSheet
        isOpen={addMetabolicOpen}
        onClose={() => setAddMetabolicOpen(false)}
      />
    </>
  )
}
