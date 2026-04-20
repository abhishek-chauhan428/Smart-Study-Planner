import { formatMinutes } from '../../utils/formatTime.js'
import { parseLocalDate } from '../../utils/taskDates.js'

function formatDeadline(yyyyMmDd) {
  try {
    return parseLocalDate(yyyyMmDd).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return yyyyMmDd
  }
}

/**
 * @param {{ task: object, onEdit: () => void, onToggle: () => void, onDelete: () => void }} props
 */
export function TaskCard({ task, onEdit, onToggle, onDelete }) {
  const done = task.status === 'completed'

  return (
    <li
      className={`rounded-xl border px-4 py-3 dark:border-slate-700 ${
        done
          ? 'border-slate-200 bg-slate-50/80 dark:bg-slate-900/40'
          : 'border-slate-200 bg-white dark:bg-[#16171d]'
      }`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p
            className={`font-semibold text-slate-900 dark:text-gray-100 ${done ? 'line-through opacity-70' : ''}`}
          >
            {task.title}
          </p>
          {task.subject ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">{task.subject}</p>
          ) : null}
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
            Due {formatDeadline(task.deadline)} · Est. {formatMinutes(task.estimatedMinutes)}
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={onToggle}
          >
            {done ? 'Mark pending' : 'Complete'}
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/30"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  )
}
