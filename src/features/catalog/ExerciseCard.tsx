import { EQUIPMENT_LABELS } from './equipmentLabels'
import type { Exercise } from './types'

type Props = {
  exercise: Exercise
  onClick: (id: string) => void
}

export const ExerciseCard = ({ exercise, onClick }: Props) => {
  return (
    <button
      type="button"
      className="w-full rounded-xl bg-gray-900 px-4 py-3.5 text-left active:bg-gray-800"
      onClick={() => onClick(exercise.id)}
    >
      <p className="font-semibold text-white">{exercise.name}</p>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {exercise.primaryMuscles.map((muscle) => (
          <span
            key={muscle.id}
            className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-400"
          >
            {muscle.name}
          </span>
        ))}
        <span className="rounded-full bg-indigo-950 px-2.5 py-0.5 text-xs text-indigo-300">
          {EQUIPMENT_LABELS[exercise.equipment]}
        </span>
      </div>
    </button>
  )
}
