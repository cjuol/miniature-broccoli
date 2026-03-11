import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import { useWorkoutSessionStore } from './workoutSessionStore'
import type { WorkoutSession } from './types'

export const useSession = () => {
  const sessionId = useWorkoutSessionStore((s) => s.sessionId)

  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => apiFetch<WorkoutSession>(`/sessions/${sessionId}`),
    enabled: !!sessionId,
  })
}
