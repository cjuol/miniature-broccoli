import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import type { TrainingDaySummary } from './types'

type Params = {
  year?: number
  month?: number
}

export const useTrainingDays = (params: Params = {}) => {
  const now = new Date()
  const year = params.year ?? now.getFullYear()
  const month = params.month ?? now.getMonth() + 1

  return useQuery({
    queryKey: ['training-days', year, month],
    queryFn: () =>
      apiFetch<TrainingDaySummary[]>(`/v1/training-days?year=${year}&month=${month}`),
  })
}
