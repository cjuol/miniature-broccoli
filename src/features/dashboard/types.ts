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
  exerciseEntries: ExerciseEntrySummary[]
}

export type TrainingDaySummary = {
  id: string
  date: string  // YYYY-MM-DD
  workoutSessions: SessionSummary[]
}
