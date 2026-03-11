export type Equipment =
  | 'BARBELL'
  | 'DUMBBELL'
  | 'CABLE'
  | 'MACHINE'
  | 'BODYWEIGHT'
  | 'KETTLEBELL'
  | 'RESISTANCE'
  | 'SMITH'
  | 'PULLEY'
  | 'NONE'

export type MuscleGroup = {
  id: string
  name: string
  slug: string
}

export type Exercise = {
  id: string
  name: string
  description?: string
  instructions?: string
  videoUrl?: string
  equipment: Equipment
  primaryMuscles: MuscleGroup[]
  secondaryMuscles: MuscleGroup[]
}

export type ExerciseFilters = {
  search?: string
  muscleGroup?: string
  equipment?: Equipment
}
