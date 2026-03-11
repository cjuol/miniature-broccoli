import { EQUIPMENT_LABELS } from './equipmentLabels'
import { useExercise } from './useExercise'

type Props = {
  exerciseId: string | null
  onClose: () => void
}

export const ExerciseSheet = ({ exerciseId, onClose }: Props) => {
  const { data: exercise, isLoading } = useExercise(exerciseId)
  const isOpen = !!exerciseId

  return (
    <>
      {/* Overlay — cierra el sheet al tocar fuera */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-gray-900 transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle visual */}
        <div className="flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-gray-700" />
        </div>

        <div className="p-5 pb-10">
          {isLoading && (
            <div className="space-y-3">
              <div className="h-6 w-2/3 animate-pulse rounded-lg bg-gray-800" />
              <div className="h-4 w-1/3 animate-pulse rounded-lg bg-gray-800" />
              <div className="mt-4 h-20 animate-pulse rounded-lg bg-gray-800" />
            </div>
          )}

          {exercise && (
            <>
              <h2 className="text-xl font-bold text-white">{exercise.name}</h2>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-indigo-950 px-2.5 py-0.5 text-xs text-indigo-300">
                  {EQUIPMENT_LABELS[exercise.equipment]}
                </span>
                {exercise.primaryMuscles.map((m) => (
                  <span key={m.id} className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-400">
                    {m.name}
                  </span>
                ))}
                {exercise.secondaryMuscles.map((m) => (
                  <span key={m.id} className="rounded-full bg-gray-800/50 px-2.5 py-0.5 text-xs text-gray-600">
                    {m.name}
                  </span>
                ))}
              </div>

              {exercise.description && (
                <p className="mt-4 text-sm leading-relaxed text-gray-400">{exercise.description}</p>
              )}

              {exercise.instructions && (
                <>
                  <h3 className="mt-4 text-sm font-semibold text-gray-300">Instrucciones</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-400">{exercise.instructions}</p>
                </>
              )}

              {/* Deshabilitado hasta la Fase 6 — se activará al integrar la sesión activa */}
              <button
                type="button"
                disabled
                className="mt-6 w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white disabled:opacity-40"
              >
                Añadir a sesión
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
