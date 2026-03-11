import { useQuery } from '@tanstack/react-query'
import type { Exercise } from './types'
import { fetchCatalogExerciseById } from './catalogApi'

export const useExercise = (id: string | null) => {
  return useQuery({
    queryKey: ['exercises', id],
    queryFn: async (): Promise<Exercise> => {
      const exercise = await fetchCatalogExerciseById(id as string)

      if (!exercise) {
        throw {
          message: 'Ejercicio no encontrado en el catálogo disponible.',
          status: 404,
        }
      }

      return exercise
    },
    // Solo lanza la peticion cuando hay un ejercicio seleccionado
    enabled: !!id,
  })
}
