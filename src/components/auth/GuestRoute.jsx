import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

export function GuestRoute() {
  const { user, authResolved } = useAuth()

  if (!authResolved) {
    return (
      <div
        className="grid min-h-[40vh] place-items-center text-sm text-slate-600 dark:text-slate-400"
        role="status"
      >
        Checking session…
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
