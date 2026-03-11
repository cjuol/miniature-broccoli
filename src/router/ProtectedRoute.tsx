import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../features/auth/authStore'

export const ProtectedRoute = () => {
  const token = useAuthStore((s) => s.token)

  if (!token) return <Navigate to="/login" replace />

  return <Outlet />
}
