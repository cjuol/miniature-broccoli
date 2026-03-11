import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import { useWorkoutSessionStore } from './workoutSessionStore'
import type { WorkoutSession } from './types'

type DeleteSetParams = {
  setId: string
  exerciseEntryId: string
}

export const useDeleteSetMutation = () => {
  const queryClient = useQueryClient()
  const sessionId = useWorkoutSessionStore((s) => s.sessionId)

  return useMutation({
    mutationFn: ({ setId }: DeleteSetParams) =>
      apiFetch<undefined>(`/v1/set-entries/${setId}`, {
        method: 'DELETE',
      }),

    onMutate: async ({ setId, exerciseEntryId }) => {
      await queryClient.cancelQueries({ queryKey: ['session', sessionId] })
      const previousSession = queryClient.getQueryData<WorkoutSession>(['session', sessionId])

      // Eliminar la serie optimistamente de la UI
      queryClient.setQueryData<WorkoutSession>(['session', sessionId], (old) => {
        if (!old) return old
        return {
          ...old,
          exerciseEntries: old.exerciseEntries.map((entry) => {
            if (entry.id !== exerciseEntryId) return entry
            return {
              ...entry,
              setEntries: entry.setEntries.filter((set) => set.id !== setId),
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
