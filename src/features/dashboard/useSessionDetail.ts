import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import type { SessionDetail } from './types'

export const useSessionDetail = (sessionId: string | null) => {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => apiFetch<SessionDetail>(`/v1/sessions/${sessionId}`),
    enabled: !!sessionId,
  })
}
