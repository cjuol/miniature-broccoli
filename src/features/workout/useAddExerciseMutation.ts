import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import { useWorkoutSessionStore } from './workoutSessionStore'
import type { AddExerciseInput, ExerciseEntry } from './types'

export const useAddExerciseMutation = () => {
  const queryClient = useQueryClient()
  const sessionId = useWorkoutSessionStore((s) => s.sessionId)

  return useMutation({
    mutationFn: (input: AddExerciseInput) =>
      apiFetch<ExerciseEntry>(`/sessions/${sessionId}/exercises`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      // El ejercicio necesita su id real del backend antes de poder registrar series
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] })
    },
  })
}
