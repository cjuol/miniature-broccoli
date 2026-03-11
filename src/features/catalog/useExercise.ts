import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import type { Exercise } from './types'

export const useExercise = (id: string | null) => {
  return useQuery({
    queryKey: ['exercises', id],
    queryFn: () => apiFetch<Exercise>(`/exercises/${id}`),
    // Solo lanza la peticion cuando hay un ejercicio seleccionado
    enabled: !!id,
  })
}
