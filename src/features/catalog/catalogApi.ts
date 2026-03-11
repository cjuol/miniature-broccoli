import { apiFetch } from '../../config/apiClient'
import type { Equipment, Exercise, ExerciseFilters } from './types'

type MesocycleSummary = {
  id: string
  startDate: string
}

type PlannedExercise = {
  exercise: {
    id: string
    name: string
    equipment: string
  }
}

type ExerciseBlock = {
  plannedExercises: PlannedExercise[]
}

type SessionTemplate = {
  exerciseBlocks: ExerciseBlock[]
}

const EQUIPMENT_MAP: Record<string, Equipment> = {
  barbell: 'BARBELL',
  dumbbell: 'DUMBBELL',
  cable: 'CABLE',
  machine: 'MACHINE',
  bodyweight: 'BODYWEIGHT',
  kettlebell: 'KETTLEBELL',
  resistance_band: 'RESISTANCE',
  smith_machine: 'SMITH',
  pulley: 'PULLEY',
  none: 'NONE',
}

const normalizeEquipment = (value: string): Equipment => {
  return EQUIPMENT_MAP[value] ?? 'NONE'
}

const pickLatestMesocycle = (mesocycles: MesocycleSummary[]): MesocycleSummary | null => {
  if (mesocycles.length === 0) return null

  return [...mesocycles].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })[0]
}

const applyFilters = (exercises: Exercise[], filters: ExerciseFilters): Exercise[] => {
  const search = filters.search?.trim().toLowerCase() ?? ''

  return exercises.filter((exercise) => {
    if (search && !exercise.name.toLowerCase().includes(search)) return false
    if (filters.equipment && exercise.equipment !== filters.equipment) return false
    // El backend actual no expone músculos en este flujo; mantenemos el filtro sin bloquear la UI.
    return true
  })
}

export const fetchCatalogExercises = async (filters: ExerciseFilters = {}): Promise<Exercise[]> => {
  const mesocycles = await apiFetch<MesocycleSummary[]>('/v1/mesocycles')
  const latestMesocycle = pickLatestMesocycle(mesocycles)

  if (!latestMesocycle) return []

  const sessions = await apiFetch<SessionTemplate[]>(`/v1/mesocycles/${latestMesocycle.id}/sessions`)

  const byId = new Map<string, Exercise>()

  for (const session of sessions) {
    for (const block of session.exerciseBlocks) {
      for (const plannedExercise of block.plannedExercises) {
        const raw = plannedExercise.exercise
        if (byId.has(raw.id)) continue

        byId.set(raw.id, {
          id: raw.id,
          name: raw.name,
          equipment: normalizeEquipment(raw.equipment),
          primaryMuscles: [],
          secondaryMuscles: [],
        })
      }
    }
  }

  const uniqueExercises = Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name))
  return applyFilters(uniqueExercises, filters)
}

export const fetchCatalogExerciseById = async (id: string): Promise<Exercise | null> => {
  const exercises = await fetchCatalogExercises()
  return exercises.find((exercise) => exercise.id === id) ?? null
}
