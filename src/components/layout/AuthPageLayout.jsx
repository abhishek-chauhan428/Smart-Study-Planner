import { Link, Outlet } from 'react-router-dom'

export function AuthPageLayout() {
  return (
    <div className="grid min-h-svh place-items-center bg-[#f8f7fb] px-4 py-8 dark:bg-[#0f1117]">
      <div className="w-full max-w-[420px] rounded-[10px] border border-slate-200 bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-slate-700 dark:bg-[#16171d] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <Link
          to="/login"
          className="mb-6 inline-block font-semibold text-slate-900 no-underline hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-300"
        >
          Smart Study Planner
        </Link>
        <Outlet />
      </div>
    </div>
  )
}
