import { useState } from 'react'
import { ExerciseCard } from '../catalog/ExerciseCard'
import { useExercises } from '../catalog/useExercises'
import { useAddExerciseMutation } from './useAddExerciseMutation'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const AddExerciseSheet = ({ isOpen, onClose }: Props) => {
  const [search, setSearch] = useState('')
  const { data: exercises, isLoading } = useExercises(search ? { search } : {})
  const { mutate: addExercise, isPending } = useAddExerciseMutation()

  const handleSelect = (exerciseId: string) => {
    addExercise({ exerciseId })
    onClose()
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl bg-gray-950 transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-center pt-3 shrink-0">
          <div className="h-1 w-10 rounded-full bg-gray-700" />
        </div>

        <div className="shrink-0 px-5 pt-3 pb-3">
          <h2 className="text-lg font-bold text-white">Añadir ejercicio</h2>
          <input
            type="search"
            placeholder="Buscar…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-3 w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-10">
          {isLoading && (
            <div className="space-y-2 pt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-900" />
              ))}
            </div>
          )}

          {exercises && !isPending && (
            <div className="space-y-2 pt-2">
              {exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onClick={handleSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
