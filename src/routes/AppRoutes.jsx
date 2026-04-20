import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute } from '../components/auth/GuestRoute.jsx'
import { ProtectedRoute } from '../components/auth/ProtectedRoute.jsx'
import { AuthPageLayout } from '../components/layout/AuthPageLayout.jsx'
import { MainLayout } from '../components/layout/MainLayout.jsx'

// Lazy-loaded page components — each page is split into its own JS chunk.
// React will only download and parse a page's code when the user first navigates to it.
const DashboardPage  = lazy(() => import('../pages/DashboardPage.jsx').then(m => ({ default: m.DashboardPage })))
const TasksPage      = lazy(() => import('../pages/TasksPage.jsx').then(m => ({ default: m.TasksPage })))
const SessionPage    = lazy(() => import('../pages/SessionPage.jsx').then(m => ({ default: m.SessionPage })))
const AnalyticsPage  = lazy(() => import('../pages/AnalyticsPage.jsx').then(m => ({ default: m.AnalyticsPage })))
const ProfilePage    = lazy(() => import('../pages/ProfilePage.jsx').then(m => ({ default: m.ProfilePage })))
const LoginPage      = lazy(() => import('../pages/LoginPage.jsx').then(m => ({ default: m.LoginPage })))
const SignupPage     = lazy(() => import('../pages/SignupPage.jsx').then(m => ({ default: m.SignupPage })))
const NotFoundPage   = lazy(() => import('../pages/NotFoundPage.jsx').then(m => ({ default: m.NotFoundPage })))

// Fallback UI shown while a lazy page chunk is being loaded
function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route element={<AuthPageLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="session" element={<SessionPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
