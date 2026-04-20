import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-[1.75rem] font-semibold text-slate-900 dark:text-gray-100">
        Page not found
      </h1>
      <p className="max-w-[52ch] text-slate-600 dark:text-slate-400">
        The page you requested does not exist.
      </p>
      <Link
        to="/dashboard"
        className="inline-block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white no-underline hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
      >
        Go to dashboard
      </Link>
    </div>
  )
}
