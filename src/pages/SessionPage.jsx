import { useState } from 'react'
import { useTasks } from '../hooks/useTasks.js'
import { useSessions } from '../hooks/useSessions.js'

function formatMMSS(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function SessionPage() {
  const { tasks } = useTasks()
  const sessionContext = useSessions()

  const {
    // Config State
    totalSession, setTotalSession,
    slotDuration, setSlotDuration,
    breakDuration, setBreakDuration,
    selectedTask, setSelectedTask,
    customTaskName, setCustomTaskName,

    // Timer State
    phase,
    slots,
    currentSlotIdx,
    timeRemaining,
    totalStudySlots,
    totalBreakSlots,

    // Actions
    startSession,
    pauseSession,
    stopSession,
    resetSession,
    saveCurrentSession
  } = sessionContext

  const pendingTasks = tasks.filter((t) => t.status === 'pending')

  // Focus Rating State (local to this component since it's just for the final step)
  const [focusRating, setFocusRating] = useState(5)

  const handleSaveSession = () => {
    saveCurrentSession(focusRating)
    setFocusRating(5)
  }

  const handleCancelSession = () => {
    resetSession()
  }

  const renderSetup = () => (
    <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#16171d]">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-gray-100">
        Configure Study Session
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Link to a Task (Optional)
          </label>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 sm:text-sm"
          >
            <option value="">-- No specific task --</option>
            <option value="custom">-- Enter custom task  --</option>
            {pendingTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          {selectedTask === 'custom' && (
            <input
              type="text"
              placeholder="What are you studying?"
              value={customTaskName}
              onChange={(e) => setCustomTaskName(e.target.value)}
              className="p-[10px] mt-3 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 sm:text-sm"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Total Session Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            value={totalSession}
            onChange={(e) => setTotalSession(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Study Slot (mins)
            </label>
            <input
              type="number"
              min="1"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Break (mins)
            </label>
            <input
              type="number"
              min="0"
              value={breakDuration}
              onChange={(e) => setBreakDuration(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 sm:text-sm"
            />
          </div>
        </div>

        <button
          onClick={startSession}
          disabled={(selectedTask === 'custom' && !customTaskName.trim()) || Number(slotDuration) > Number(totalSession)}
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Start Session
        </button>
        {Number(slotDuration) > Number(totalSession) && (
          <p className="mt-2 text-xs text-red-500">Study slot duration cannot exceed total session duration.</p>
        )}
      </div>
    </div>
  )

  const renderTimer = () => {
    const currentSlot = slots[currentSlotIdx]
    if (!currentSlot) return null

    const isStudy = currentSlot.type === 'study'

    const totalSessionSeconds = Number(totalSession) * 60
    let elapsedSeconds = 0
    for (let i = 0; i < currentSlotIdx; i++) {
      elapsedSeconds += slots[i].duration
    }
    elapsedSeconds += (currentSlot.duration - timeRemaining)
    const progressPercent = Math.min(100, Math.max(0, (elapsedSeconds / totalSessionSeconds) * 100))

    const activeTaskObj = tasks.find((t) => t.id === selectedTask)

    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-[#16171d] dark:shadow-none">
        {/* Header section: Phase & Task */}
        <div className="mb-8 flex items-start justify-between">
          <div className="text-left">
            <h2 className={`text-lg font-bold uppercase tracking-wider ${isStudy ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
              {isStudy ? 'Study Phase' : 'Break Phase'}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              {isStudy
                ? `Slot ${currentSlot.index} of ${totalStudySlots}`
                : `Break ${currentSlot.index} of ${totalBreakSlots}`}
            </p>
          </div>

          <div className="text-right">
            {activeTaskObj ? (
              <div className="inline-flex max-w-[220px] items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800/50">
                <span className="mr-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                  Task:
                </span>
                <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {activeTaskObj.title}
                </span>
              </div>
            ) : selectedTask === 'custom' && customTaskName ? (
              <div className="inline-flex max-w-[220px] items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800/50">
                <span className="mr-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                  Task:
                </span>
                <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {customTaskName}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800/50">
                <span className="mr-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                  Task:
                </span>
                <span className="text-xs font-medium italic text-slate-500 dark:text-slate-400">
                  General
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Huge Timer */}
        <div className="mb-10 py-4 font-mono text-[5.5rem] leading-none tracking-tight text-slate-900 dark:text-gray-100">
          {formatMMSS(timeRemaining)}
        </div>

        {/* Progress Section */}
        <div className="mb-10 w-full text-left">
          <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>{formatMMSS(elapsedSeconds)}</span>
            <span>{Math.round(progressPercent)}% Done</span>
            <span>{formatMMSS(totalSessionSeconds)}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-1000 ease-linear dark:bg-blue-400"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {phase === 'running' ? (
            <button
              onClick={pauseSession}
              className="w-32 rounded-xl bg-amber-500 py-3 text-sm font-bold tracking-wide text-white transition-transform hover:scale-105 hover:bg-amber-600 focus:ring-4 focus:ring-amber-500/30"
            >
              PAUSE
            </button>
          ) : (
            <button
              onClick={startSession}
              className="w-32 rounded-xl bg-blue-600 py-3 text-sm font-bold tracking-wide text-white transition-transform hover:scale-105 hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/30"
            >
              RESUME
            </button>
          )}
          <button
            onClick={stopSession}
            className="w-32 rounded-xl bg-slate-100 py-3 text-sm font-bold tracking-wide text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            STOP
          </button>
        </div>
      </div>
    )
  }

  const renderRating = () => (
    <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#16171d]">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-gray-100">
        Session Finished
      </h2>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
        How focused were you during this session?
      </p>

      <div className="mb-6 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => setFocusRating(rating)}
            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold transition-colors ${focusRating >= rating
              ? 'bg-amber-400 text-amber-900'
              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
              }`}
          >
            ★
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSaveSession}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save Session
        </button>
        <button
          onClick={handleCancelSession}
          className="flex-1 rounded-md bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-gray-100 dark:hover:bg-slate-600"
        >
          Discard
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <h1 className="mb-6 text-[1.75rem] font-semibold text-slate-900 dark:text-gray-100">
        Study Session
      </h1>

      {phase === 'setup' && renderSetup()}
      {(phase === 'running' || phase === 'paused') && renderTimer()}
      {phase === 'rating' && renderRating()}
    </div>
  )
}
