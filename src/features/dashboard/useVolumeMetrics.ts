import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import type { MuscleVolume } from './types'

type VolumeResponse = {
  from: string
  to: string
  muscles: MuscleVolume[]
}

export const useVolumeMetrics = (from: string, to: string) =>
  useQuery({
    queryKey: ['volume-metrics', from, to],
    queryFn: () =>
      apiFetch<VolumeResponse>(`/v1/metrics/volume?from=${from}&to=${to}`),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
