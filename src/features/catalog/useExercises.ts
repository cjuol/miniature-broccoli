import { useQuery } from '@tanstack/react-query'
import type { ExerciseFilters } from './types'
import { fetchCatalogExercises } from './catalogApi'

export const useExercises = (filters: ExerciseFilters = {}) => {
  return useQuery({
    queryKey: ['exercises', filters],
    queryFn: () => fetchCatalogExercises(filters),
  })
}
