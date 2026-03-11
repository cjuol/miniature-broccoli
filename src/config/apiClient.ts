import { useAuthStore } from '../features/auth/authStore'

const BASE_URL = import.meta.env.VITE_API_URL as string

export type ApiError = {
  message: string
  status: number
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    const error: ApiError = {
      message: (await response.json().catch(() => ({ message: response.statusText }))).message,
      status: response.status,
    }
    throw error
  }

  // 204 No Content no tiene body
  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}
