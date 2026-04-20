import { Link, NavLink, Outlet } from 'react-router-dom'

function navLinkClass({ isActive }) {
  const base =
    'px-4 py-2 text-[15px] font-medium transition-colors no-underline hover:no-underline'
  if (isActive) {
    return `${base} text-blue-600 dark:text-blue-400 font-semibold`
  }
  return `${base} text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400`
}

function profileNavClass({ isActive }) {
  const base =
    'inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 no-underline transition-colors hover:no-underline dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
  if (isActive) {
    return `${base} text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30`
  }
  return base
}

function LogoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

export function MainLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-white dark:bg-[#0f1117] font-sans">
      <header className="sticky top-0 z-10 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md px-6 py-4 dark:border-slate-800 dark:bg-[#16171d]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-bold text-[19px] text-blue-600 tracking-tight no-underline transition-opacity hover:opacity-80 dark:text-blue-500"
            aria-label="Smart Study Planner"
          >
            <LogoIcon />
            StudyPlanner
          </Link>
          
          <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-2" aria-label="Primary">
            <NavLink to="/dashboard" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/tasks" className={navLinkClass}>
              Tasks
            </NavLink>
            <NavLink to="/session" className={navLinkClass}>
              Focus Session
            </NavLink>
            <NavLink to="/analytics" className={navLinkClass}>
              Analytics
            </NavLink>
          </nav>
          
          <div className="flex items-center gap-3">
            <NavLink
              to="/profile"
              className={profileNavClass}
              aria-label="Profile"
              title="Profile"
            >
              <ProfileIcon />
            </NavLink>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
