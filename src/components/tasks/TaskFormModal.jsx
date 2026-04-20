import { useEffect, useState } from 'react'
import { toYyyyMmDd } from '../../utils/taskDates.js'

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-[#f8f7fb] px-3 py-2 text-sm text-slate-900 outline-none focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-blue-400/50 dark:border-slate-600 dark:bg-[#0f1117] dark:text-gray-100'

/**
 * @param {{ open: boolean, onClose: () => void, task: object | null, onSubmit: (data: object) => void }} props
 */
export function TaskFormModal({ open, onClose, task, onSubmit }) {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [deadline, setDeadline] = useState('')
  const [estimatedMinutes, setEstimatedMinutes] = useState(30)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setError('')
    if (task) {
      setTitle(task.title || '')
      setSubject(task.subject || '')
      setDeadline(task.deadline || toYyyyMmDd(new Date()))
      setEstimatedMinutes(task.estimatedMinutes ?? 30)
    } else {
      setTitle('')
      setSubject('')
      setDeadline(toYyyyMmDd(new Date()))
      setEstimatedMinutes(30)
    }
  }, [open, task?.id])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    if (!deadline) {
      setError('Deadline is required.')
      return
    }
    onSubmit({
      title: title.trim(),
      subject: subject.trim(),
      deadline,
      estimatedMinutes,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-[#16171d]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="task-modal-title"
          className="mb-4 text-lg font-semibold text-slate-900 dark:text-gray-100"
        >
          {task ? 'Edit task' : 'Add task'}
        </h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </p>
          ) : null}
          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Title</span>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </label>
          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Subject</span>
            <input className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Deadline</span>
            <input
              className={inputClass}
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Estimated time (minutes)
            </span>
            <input
              className={inputClass}
              type="number"
              min={0}
              step={5}
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
            />
          </label>
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {task ? 'Save' : 'Add task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
