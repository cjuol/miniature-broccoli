import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import { useAuthStore } from './authStore'
import type { LoginCredentials, LoginResponse } from './types'

export const useLoginMutation = () => {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    onSuccess: ({ token, user }) => {
      setAuth(token, user)
    },
  })
}
