import { useState } from 'react'
import { useAddExerciseMutation } from '../workout/useAddExerciseMutation'
import { useWorkoutSessionStore } from '../workout/workoutSessionStore'
import { ExerciseCard } from './ExerciseCard'
import { ExerciseSheet } from './ExerciseSheet'
import { MUSCLE_GROUPS } from './equipmentLabels'
import { useExercises } from './useExercises'
import type { ExerciseFilters } from './types'

const SkeletonCard = () => (
  <div className="rounded-xl bg-gray-900 px-4 py-3.5">
    <div className="h-5 w-1/2 animate-pulse rounded-lg bg-gray-800" />
    <div className="mt-2.5 flex gap-2">
      <div className="h-4 w-16 animate-pulse rounded-full bg-gray-800" />
      <div className="h-4 w-12 animate-pulse rounded-full bg-gray-800" />
    </div>
  </div>
)

export default function CatalogPage() {
  const [search, setSearch] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null)
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null)
  const [exerciseAdded, setExerciseAdded] = useState(false)

  const sessionId = useWorkoutSessionStore((s) => s.sessionId)
  const { mutate: addExercise, isPending: isAdding } = useAddExerciseMutation()

  const filters: ExerciseFilters = {
    ...(search ? { search } : {}),
    ...(selectedMuscle ? { muscleGroup: selectedMuscle } : {}),
  }

  const { data: exercises, isLoading, isError } = useExercises(filters)

  const toggleMuscle = (slug: string) => {
    setSelectedMuscle((prev) => (prev === slug ? null : slug))
  }

  return (
    <>
      <div className="flex flex-col gap-4 px-4 pt-8">
        <h1 className="text-2xl font-bold text-white">Catálogo</h1>

        {/* Buscador */}
        <input
          type="search"
          placeholder="Buscar ejercicio…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />

        {/* Chips de grupos musculares — scroll horizontal sin barra visible */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {MUSCLE_GROUPS.map((group) => (
            <button
              key={group.slug}
              type="button"
              onClick={() => toggleMuscle(group.slug)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                selectedMuscle === group.slug
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>

        {/* Lista de ejercicios */}
        <div className="flex flex-col gap-2 pb-6">
          {isLoading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

          {isError && (
            <p className="py-8 text-center text-sm text-red-400">
              Error al cargar los ejercicios. Inténtalo de nuevo.
            </p>
          )}

          {exercises && exercises.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500">
              No se encontraron ejercicios.
            </p>
          )}

          {exercises?.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onClick={setSelectedExerciseId}
            />
          ))}
        </div>
      </div>

      <ExerciseSheet
        exerciseId={selectedExerciseId}
        onClose={() => {
          setExerciseAdded(false)
          setSelectedExerciseId(null)
        }}
        sessionActive={!!sessionId}
        isAddingToSession={isAdding}
        wasAddedToSession={exerciseAdded}
        onAddToSession={(id) => addExercise({ exerciseId: id }, { onSuccess: () => setExerciseAdded(true) })}
      />
    </>
  )
}
