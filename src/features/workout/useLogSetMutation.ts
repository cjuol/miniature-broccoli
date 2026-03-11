import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import { useWorkoutSessionStore } from './workoutSessionStore'
import type { LogSetInput, SetEntry, WorkoutSession } from './types'

type LogSetParams = {
  exerciseEntryId: string
  input: LogSetInput
}

export const useLogSetMutation = () => {
  const queryClient = useQueryClient()
  const sessionId = useWorkoutSessionStore((s) => s.sessionId)

  return useMutation({
    mutationFn: ({ exerciseEntryId, input }: LogSetParams) =>
      apiFetch<SetEntry>(`/exercise-entries/${exerciseEntryId}/sets`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),

    onMutate: async ({ exerciseEntryId, input }) => {
      await queryClient.cancelQueries({ queryKey: ['session', sessionId] })
      const previousSession = queryClient.getQueryData<WorkoutSession>(['session', sessionId])

      // La serie aparece de inmediato en la UI sin esperar la respuesta del backend
      queryClient.setQueryData<WorkoutSession>(['session', sessionId], (old) => {
        if (!old) return old
        return {
          ...old,
          exerciseEntries: old.exerciseEntries.map((entry) => {
            if (entry.id !== exerciseEntryId) return entry
            const optimisticSet: SetEntry = {
              id: `pending_${Date.now()}`,
              sortOrder: entry.setEntries.length + 1,
              weightKg: input.weightKg,
              repsCompleted: input.repsCompleted,
              rirActual: input.rirActual ?? null,
              toFailure: input.toFailure,
              durationSeconds: null,
              type: 'NORMAL',
            }
            return { ...entry, setEntries: [...entry.setEntries, optimisticSet] }
          }),
        }
      })

      return { previousSession }
    },

    onError: (_err, _vars, context) => {
      // Si la petición falla, revertimos al estado anterior
      queryClient.setQueryData(['session', sessionId], context?.previousSession)
    },

    onSettled: () => {
      // Reconciliamos con el servidor para confirmar el id real de la serie
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] })
    },
  })
}
