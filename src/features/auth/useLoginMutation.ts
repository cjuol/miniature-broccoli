import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '../../config/apiClient'
import { useAuthStore } from './authStore'
import type { ApiError } from '../../config/apiClient'
import type { LoginCredentials, LoginResponse } from './types'

export const useLoginMutation = () => {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation<LoginResponse, ApiError, LoginCredentials>({
    mutationFn: (credentials) =>
      apiFetch<LoginResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    onSuccess: ({ token, user }) => {
      setAuth(token, user)
    },
  })
}
