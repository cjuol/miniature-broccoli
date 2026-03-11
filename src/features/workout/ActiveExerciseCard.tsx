import { useState } from 'react'
import { EditSetSheet } from './EditSetSheet'
import { LogSetSheet } from './LogSetSheet'
import type { ExerciseEntry, SetEntry } from './types'

type Props = {
  entry: ExerciseEntry
}

export const ActiveExerciseCard = ({ entry }: Props) => {
  const [logSheetOpen, setLogSheetOpen] = useState(false)
  const [selectedSet, setSelectedSet] = useState<SetEntry | null>(null)

  return (
    <>
      <div className="rounded-xl bg-gray-900 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">{entry.exercise.name}</h3>
          <span className="text-xs text-gray-500">{entry.setEntries.length} series</span>
        </div>

        {entry.setEntries.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {entry.setEntries.map((set, i) => {
              const isPending = set.id.startsWith('pending_')
              return (
                <button
                  key={set.id}
                  type="button"
                  disabled={isPending}
                  onClick={() => setSelectedSet(set)}
                  className="flex w-full items-center gap-3 rounded-lg px-1 py-0.5 text-left active:bg-gray-800 disabled:pointer-events-none"
                >
                  <span className="w-5 text-xs text-gray-600">{i + 1}</span>
                  <span className="text-sm text-gray-300">
                    {set.weightKg} kg × {set.repsCompleted} reps
                  </span>
                  <span className="text-xs text-gray-500">
                    {set.toFailure ? 'al fallo' : set.rirActual !== null ? `RIR ${set.rirActual}` : ''}
                  </span>
                  {/* Indicador visual de que la serie está en tránsito optimista */}
                  {isPending && (
                    <span className="ml-auto h-3 w-3 animate-spin rounded-full border-2 border-gray-700 border-t-indigo-400" />
                  )}
                </button>
              )
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => setLogSheetOpen(true)}
          className="mt-3 w-full rounded-lg bg-gray-800 py-2 text-sm font-medium text-indigo-400 active:bg-gray-700"
        >
          + Registrar serie
        </button>
      </div>

      <LogSetSheet
        exerciseEntryId={entry.id}
        exerciseId={entry.exercise.id}
        exerciseName={entry.exercise.name}
        isOpen={logSheetOpen}
        onClose={() => setLogSheetOpen(false)}
      />

      {selectedSet && (
        <EditSetSheet
          set={selectedSet}
          exerciseEntryId={entry.id}
          exerciseName={entry.exercise.name}
          isOpen={selectedSet !== null}
          onClose={() => setSelectedSet(null)}
        />
      )}
    </>
  )
}
