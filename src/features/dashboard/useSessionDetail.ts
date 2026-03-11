import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
// Reutilizamos WorkoutSession del feature workout ya que session:read devuelve la misma forma
import type { WorkoutSession } from '../workout/types'

export const useSessionDetail = (sessionId: string | null) => {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => apiFetch<WorkoutSession>(`/v1/sessions/${sessionId}`),
    enabled: !!sessionId,
  })
}
