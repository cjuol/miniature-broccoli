import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import { useWorkoutSessionStore } from './workoutSessionStore'
import type { WorkoutSession } from './types'

export const useStartSessionMutation = () => {
  const startSession = useWorkoutSessionStore((s) => s.startSession)

  return useMutation({
    mutationFn: () =>
      apiFetch<WorkoutSession>('/sessions', { method: 'POST', body: JSON.stringify({}) }),
    onSuccess: (session) => {
      startSession(session.id)
    },
  })
}
