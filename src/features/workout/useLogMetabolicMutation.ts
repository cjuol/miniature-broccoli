import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import { useWorkoutSessionStore } from './workoutSessionStore'
import type { MetabolicEntry, WorkoutSession } from './types'

export type LogMetabolicInput = {
  rounds?: number
  timeSeconds?: number
  result?: string
  notes?: string
}

export const useLogMetabolicMutation = () => {
  const queryClient = useQueryClient()
  const sessionId = useWorkoutSessionStore((s) => s.sessionId)

  return useMutation({
    mutationFn: (input: LogMetabolicInput) =>
      apiFetch<MetabolicEntry>(`/v1/sessions/${sessionId}/metabolic`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),

    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['session', sessionId] })
      const previousSession = queryClient.getQueryData<WorkoutSession>(['session', sessionId])

      const optimisticEntry: MetabolicEntry = {
        id: `pending_${Date.now()}`,
        weekNumber: null,
        roundsCompleted: input.rounds ?? null,
        timeSeconds: input.timeSeconds ?? null,
        result: input.result ?? null,
        notes: input.notes ?? null,
      }

      queryClient.setQueryData<WorkoutSession>(['session', sessionId], (old) => {
        if (!old) return old
        return { ...old, metabolicEntries: [...old.metabolicEntries, optimisticEntry] }
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
