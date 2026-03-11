import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import { useWorkoutSessionStore } from './workoutSessionStore'
import type { CardioEntry, CardioType, WorkoutSession } from './types'

export type LogCardioInput = {
  type: CardioType
  durationSeconds: number
  distanceMeters?: number
  avgSpeedKmh?: number
  inclinePct?: number
  notes?: string
}

export const useLogCardioMutation = () => {
  const queryClient = useQueryClient()
  const sessionId = useWorkoutSessionStore((s) => s.sessionId)

  return useMutation({
    mutationFn: (input: LogCardioInput) =>
      apiFetch<CardioEntry>(`/v1/sessions/${sessionId}/cardio`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),

    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['session', sessionId] })
      const previousSession = queryClient.getQueryData<WorkoutSession>(['session', sessionId])

      // Bloque de cardio aparece inmediatamente en la UI
      const optimisticEntry: CardioEntry = {
        id: `pending_${Date.now()}`,
        cardioType: input.type,
        durationSeconds: input.durationSeconds,
        distanceMeters: input.distanceMeters ?? null,
        avgSpeedKmh: input.avgSpeedKmh ?? null,
        inclinePct: input.inclinePct ?? null,
        notes: input.notes ?? null,
        paceMinPerKm:
          input.distanceMeters && input.distanceMeters > 0
            ? (input.durationSeconds / 60) / (input.distanceMeters / 1000)
            : null,
      }

      queryClient.setQueryData<WorkoutSession>(['session', sessionId], (old) => {
        if (!old) return old
        return { ...old, cardioEntries: [...old.cardioEntries, optimisticEntry] }
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
