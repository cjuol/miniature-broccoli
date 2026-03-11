import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      {/* Contenido principal con padding inferior para que no quede tapado por el BottomNav */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
