import { useAuth } from '../hooks/useAuth.js'

function Row({ label, value }) {
  return (
    <div className="border-b border-slate-200 py-3 last:border-0 dark:border-slate-700">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-900 dark:text-gray-100">{value || '—'}</dd>
    </div>
  )
}

export function ProfilePage() {
  const { user, logout } = useAuth()

  return (
    <div>
      <h1 className="mb-2 text-[1.75rem] font-semibold text-slate-900 dark:text-gray-100">Profile</h1>
      <p className="mb-6 max-w-[52ch] text-slate-600 dark:text-slate-400">
        Your account details, powered by Firebase Authentication.
      </p>
      <div className="max-w-md rounded-[10px] border border-slate-200 bg-white px-5 py-1 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-slate-700 dark:bg-[#16171d] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <dl>
          <Row label="Display name" value={user?.displayName} />
          <Row label="Email" value={user?.email} />
          <Row label="Account ID" value={user?.uid} />
        </dl>
      </div>
      <div className="mt-6 max-w-md">
        <button
          type="button"
          className="w-full cursor-pointer rounded-lg border border-slate-200 bg-transparent px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-100 sm:w-auto"
          onClick={() => logout()}
        >
          Log out
        </button>
      </div>
    </div>
  )
}
