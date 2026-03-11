export type SessionStatus = 'ACTIVE' | 'FINISHED'

export type SetType =
  | 'NORMAL'
  | 'TOP_SET'
  | 'AMRAP'
  | 'BACK_OFF'
  | 'DESCENDING'
  | 'SET_COUNTDOWN'
  | 'CLUSTER'
  | 'REST_PAUSE'
  | 'SUPERSET'
  | 'POLIQUIN'
  | 'PARTIAL_FULL'
  | 'PAP'

export type SetEntry = {
  id: string
  sortOrder: number
  weightKg: number
  repsCompleted: number
  rirActual: number | null
  toFailure: boolean
  durationSeconds: number | null
  notes?: string
  type: SetType
}

export type ExerciseEntry = {
  id: string
  sortOrder: number
  notes?: string
  // Solo los campos necesarios para la UI de sesión activa
  exercise: { id: string; name: string }
  setEntries: SetEntry[]
}

export type WorkoutSession = {
  id: string
  status: SessionStatus
  startedAt: string
  finishedAt?: string
  exerciseEntries: ExerciseEntry[]
}

export type LogSetInput = {
  weightKg: number
  repsCompleted: number
  rirActual?: number
  toFailure: boolean
}

export type AddExerciseInput = {
  exerciseId: string
}
