import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import type { Exercise, ExerciseFilters } from './types'

const buildQueryString = (filters: ExerciseFilters): string => {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.muscleGroup) params.set('muscleGroup', filters.muscleGroup)
  if (filters.equipment) params.set('equipment', filters.equipment)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const useExercises = (filters: ExerciseFilters = {}) => {
  return useQuery({
    queryKey: ['exercises', filters],
    queryFn: () => apiFetch<Exercise[]>(`/exercises${buildQueryString(filters)}`),
  })
}
