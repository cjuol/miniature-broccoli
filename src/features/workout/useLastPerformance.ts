import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import type { LastPerformance } from './types'

export const useLastPerformance = (exerciseId: string, enabled: boolean) =>
  useQuery({
    queryKey: ['last-performance', exerciseId],
    queryFn: () => apiFetch<LastPerformance>(`/v1/exercises/${exerciseId}/last-performance`),
    enabled,
    // El rendimiento anterior no cambia durante una sesión activa
    staleTime: Infinity,
  })
