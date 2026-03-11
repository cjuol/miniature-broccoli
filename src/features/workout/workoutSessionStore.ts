import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type WorkoutSessionState = {
  sessionId: string | null
  // Timestamp unix en ms — el tiempo transcurrido se computa como Date.now() - startedAt
  startedAt: number | null
  startSession: (id: string) => void
  endSession: () => void
}

export const useWorkoutSessionStore = create<WorkoutSessionState>()(
  persist(
    (set) => ({
      sessionId: null,
      startedAt: null,
      // Al iniciar, guardamos el id y el momento exacto en que empezó el cronómetro
      startSession: (id) => set({ sessionId: id, startedAt: Date.now() }),
      // Limpiamos todo al terminar para que la página vuelva al estado inicial
      endSession: () => set({ sessionId: null, startedAt: null }),
    }),
    {
      name: 'irontrack-session',
    },
  ),
)
