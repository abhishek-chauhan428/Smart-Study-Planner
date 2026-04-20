import { useMemo, useState } from 'react'
import { TaskCard } from '../components/tasks/TaskCard.jsx'
import { TaskFormModal } from '../components/tasks/TaskFormModal.jsx'
import { useTasks } from '../hooks/useTasks.js'

function filterButtonClass(active) {
  return [
    'rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
    active
      ? 'bg-blue-600 text-white dark:bg-blue-500'
      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-[#16171d] dark:text-slate-300 dark:hover:bg-slate-800',
  ].join(' ')
}

export function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks()
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const filtered = useMemo(() => {
    if (filter === 'pending') return tasks.filter((t) => t.status === 'pending')
    if (filter === 'completed') return tasks.filter((t) => t.status === 'completed')
    return tasks
  }, [tasks, filter])

  function openAdd() {
    setEditingTask(null)
    setModalOpen(true)
  }

  function openEdit(task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingTask(null)
  }

  function handleSave(data) {
    if (editingTask) {
      updateTask(editingTask.id, data)
    } else {
      addTask(data)
    }
    closeModal()
  }

  function handleDelete(task) {
    if (window.confirm(`Delete “${task.title}”?`)) {
      deleteTask(task.id)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-[1.75rem] font-semibold text-slate-900 dark:text-gray-100">Tasks</h1>
          <p className="max-w-[52ch] text-slate-600 dark:text-slate-400">
            Add tasks, set deadlines and estimates, then mark them complete as you go.
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          onClick={openAdd}
        >
          Add task
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button type="button" className={filterButtonClass(filter === 'all')} onClick={() => setFilter('all')}>
          All ({tasks.length})
        </button>
        <button
          type="button"
          className={filterButtonClass(filter === 'pending')}
          onClick={() => setFilter('pending')}
        >
          Pending ({tasks.filter((t) => t.status === 'pending').length})
        </button>
        <button
          type="button"
          className={filterButtonClass(filter === 'completed')}
          onClick={() => setFilter('completed')}
        >
          Completed ({tasks.filter((t) => t.status === 'completed').length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-8 text-center text-sm text-slate-600 dark:border-slate-600 dark:bg-[#16171d]/60 dark:text-slate-400">
          {tasks.length === 0
            ? 'No tasks yet. Click “Add task” to create your first one.'
            : 'No tasks match this filter.'}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => openEdit(task)}
              onToggle={() => toggleComplete(task.id)}
              onDelete={() => handleDelete(task)}
            />
          ))}
        </ul>
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={closeModal}
        task={editingTask}
        onSubmit={handleSave}
      />
    </div>
  )
}
