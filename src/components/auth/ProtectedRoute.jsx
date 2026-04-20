import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

export function ProtectedRoute() {
  const { user, authResolved } = useAuth()
  const location = useLocation()

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

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
