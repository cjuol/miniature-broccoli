export type SetEntrySummary = {
  id: string
  weightKg: number
  repsCompleted: number
  rirActual: number | null
  toFailure: boolean
}

export type ExerciseEntrySummary = {
  id: string
  exercise: { id: string; name: string }
  setEntries: SetEntrySummary[]
}

export type SessionSummary = {
  id: string
  startedAt: string
  finishedAt?: string
  // exerciseEntries no está disponible en el grupo training-day:read del backend;
  // para obtenerlo hay que llamar al endpoint /v1/sessions/{id} (session:read).
  exerciseEntries?: ExerciseEntrySummary[]
}

export type TrainingDaySummary = {
  id: string
  date: string  // YYYY-MM-DD
  workoutSessions: SessionSummary[]
}

export type PersonalRecord = {
  exerciseName: string
  maxWeight: number
  date: string  // YYYY-MM-DD
}

export type MuscleVolume = {
  muscle: string
  volume: number
  sets: number
}
