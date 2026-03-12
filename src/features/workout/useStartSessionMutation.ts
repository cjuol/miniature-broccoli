import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import { useWorkoutSessionStore } from './workoutSessionStore'
import type { WorkoutSession } from './types'

export const useStartSessionMutation = () => {
  const startSession = useWorkoutSessionStore((s) => s.startSession)

  return useMutation({
    mutationFn: () => {
      // El backend organiza sesiones bajo su día de entrenamiento correspondiente
      const today = new Date().toISOString().slice(0, 10)
      return apiFetch<WorkoutSession>(`/training-days/${today}/sessions`, { method: 'POST' })
    },
    onSuccess: (session) => {
      startSession(session.id)
    },
  })
}
