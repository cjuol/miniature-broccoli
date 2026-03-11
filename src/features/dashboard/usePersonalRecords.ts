import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import type { PersonalRecord } from './types'

export const usePersonalRecords = () =>
  useQuery({
    queryKey: ['personal-records'],
    queryFn: () =>
      apiFetch<{ personalRecords: PersonalRecord[] }>('/v1/metrics/personal-records'),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
