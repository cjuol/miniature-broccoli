import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import { useWorkoutSessionStore } from './workoutSessionStore'
import type { WorkoutSession } from './types'

export const useFinishSessionMutation = () => {
  const queryClient = useQueryClient()
  const { sessionId, endSession } = useWorkoutSessionStore()

  return useMutation({
    mutationFn: () =>
      apiFetch<WorkoutSession>(`/sessions/${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'FINISHED' }),
      }),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['session', sessionId] })
      endSession()
    },
  })
}
