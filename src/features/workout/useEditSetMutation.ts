import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import { useWorkoutSessionStore } from './workoutSessionStore'
import type { LogSetInput, SetEntry, WorkoutSession } from './types'

type EditSetParams = {
  setId: string
  exerciseEntryId: string
  input: LogSetInput
}

export const useEditSetMutation = () => {
  const queryClient = useQueryClient()
  const sessionId = useWorkoutSessionStore((s) => s.sessionId)

  return useMutation({
    mutationFn: ({ setId, input }: EditSetParams) =>
      apiFetch<SetEntry>(`/v1/set-entries/${setId}`, {
        method: 'PUT',
        body: JSON.stringify({
          weightKg: input.weightKg,
          reps: input.repsCompleted,
          rir: input.rirActual,
          toFailure: input.toFailure,
        }),
      }),

    onMutate: async ({ setId, exerciseEntryId, input }) => {
      await queryClient.cancelQueries({ queryKey: ['session', sessionId] })
      const previousSession = queryClient.getQueryData<WorkoutSession>(['session', sessionId])

      // Actualizar la serie optimistamente sin esperar la respuesta del backend
      queryClient.setQueryData<WorkoutSession>(['session', sessionId], (old) => {
        if (!old) return old
        return {
          ...old,
          exerciseEntries: old.exerciseEntries.map((entry) => {
            if (entry.id !== exerciseEntryId) return entry
            return {
              ...entry,
              setEntries: entry.setEntries.map((set) => {
                if (set.id !== setId) return set
                return {
                  ...set,
                  weightKg: input.weightKg,
                  repsCompleted: input.repsCompleted,
                  rirActual: input.rirActual ?? null,
                  toFailure: input.toFailure,
                }
              }),
            }
          }),
        }
      })

      return { previousSession }
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['session', sessionId], context?.previousSession)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] })
    },
  })
}
