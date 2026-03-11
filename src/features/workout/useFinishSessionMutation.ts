import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import { useWorkoutSessionStore } from './workoutSessionStore'
import type { WorkoutSession } from './types'

export const useFinishSessionMutation = () => {
  const queryClient = useQueryClient()
  const { sessionId, endSession } = useWorkoutSessionStore()

  return useMutation({
    mutationFn: () =>
      apiFetch<WorkoutSession>(`/v1/sessions/${sessionId}/finish`, {
        method: 'PUT',
        body: JSON.stringify({}),
      }),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['session', sessionId] })
      queryClient.invalidateQueries({ queryKey: ['training-days'] })
      queryClient.invalidateQueries({ queryKey: ['training-day'] })
      endSession()
    },
  })
}
