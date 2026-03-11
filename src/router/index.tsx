import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'

const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'))
const WorkoutPage = lazy(() => import('../features/workout/WorkoutPage'))
const CatalogPage = lazy(() => import('../features/catalog/CatalogPage'))
const LoginPage = lazy(() => import('../features/auth/LoginPage'))

// Spinner mínimo para el Suspense de lazy loading — sin bloquear la UI
const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="size-8 animate-spin rounded-full border-2 border-gray-700 border-t-indigo-400" />
  </div>
)

const withSuspense = (Page: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Page />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: withSuspense(DashboardPage) },
          { path: 'workout', element: withSuspense(WorkoutPage) },
          { path: 'catalog', element: withSuspense(CatalogPage) },
        ],
      },
    ],
  },
])
