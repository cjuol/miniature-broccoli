import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from './types'

type AuthState = {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      // Limpia credenciales al hacer logout
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'irontrack-auth',
    },
  ),
)
