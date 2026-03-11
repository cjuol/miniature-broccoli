import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import type { TrainingDaySummary } from './types'

export const useTrainingDayDetail = (date: string | null) => {
  return useQuery({
    queryKey: ['training-day', date],
    queryFn: () => apiFetch<TrainingDaySummary>(`/v1/training-days/${date}`),
    // Solo carga cuando el usuario selecciona un día — evita peticiones innecesarias
    enabled: !!date,
  })
}
