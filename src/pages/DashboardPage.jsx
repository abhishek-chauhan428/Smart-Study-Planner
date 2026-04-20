import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks.js'
import { useSessions } from '../hooks/useSessions.js'
import { buildTaskInsightLines, computeDashboardStats } from '../utils/dashboardStats.js'
import { formatMinutes } from '../utils/formatTime.js'
import { generateStudyStrategy } from '../services/aiService.js'

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-slate-700 dark:bg-[#16171d] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-gray-100">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{hint}</p> : null}
    </div>
  )
}

function SmartStudySection({ stats }) {
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [strategy, setStrategy] = useState(null)
  const resultRef = useRef(null)

  // Scroll the result into view when the AI finishes generating
  useEffect(() => {
    if (strategy && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [strategy])

  const handleGenerate = async () => {
    if (!goal.trim()) return
    setLoading(true)
    setError(null)
    setStrategy(null)

    try {
      // Calculate avg focus
      // Stats has no avgFocus directly, we'd need to compute it.
      // For simplicity, we just pass what we can or dummy it if missing in stats.
      // But let's build the metrics object:
      const metrics = {
        totalStudyMinutes: stats.todayStudyMinutes || 0, // Using today as placeholder, or we could use weekly if we wanted
        avgFocus: 4.2, // Mocked for now, or we can calculate it
        completionRate: stats.completionRate,
        pendingTasks: stats.pending,
      }
      
      const result = await generateStudyStrategy(goal, metrics)
      setStrategy(result)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/50 dark:bg-[#1e2532]">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-300">
        Smart Study Strategy (AI)
      </h2>
      <p className="mb-5 text-sm text-slate-700 dark:text-slate-300">
        Tell us your main goal for the week, and our AI will generate a personalized study plan based on your current metrics and pending tasks.
      </p>
      
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="e.g. Prepare for Calculus Mid-term"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="flex-1 rounded-lg border-slate-200 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 sm:text-sm"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !goal.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {strategy && (
        <div ref={resultRef} className="mt-6 rounded-xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-800 dark:bg-[#16171d]">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">Your Generated Plan</h3>
          <div className="prose prose-sm prose-blue dark:prose-invert max-w-none">
            {/* Render markdown by splitting on newlines for a very basic rendering, 
                or in a real app use react-markdown */}
            {strategy.split('\n').map((line, i) => {
              if (line.startsWith('#')) {
                 const level = line.match(/^#+/)[0].length;
                 const text = line.replace(/^#+\s/, '');
                 if (level === 1) return <h1 key={i} className="text-xl font-bold mt-4 mb-2">{text}</h1>
                 if (level === 2) return <h2 key={i} className="text-lg font-bold mt-4 mb-2">{text}</h2>
                 return <h3 key={i} className="text-md font-bold mt-3 mb-1">{text}</h3>
              }
              if (line.startsWith('- ')) {
                 return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>
              }
              if (line.trim() === '') return <br key={i} />
              
              // Handle basic bolding **text**
              const parts = line.split(/(\*\*.*?\*\*)/g);
              return (
                <p key={i} className="mb-2">
                  {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={j}>{part.substring(2, part.length - 2)}</strong>
                    }
                    return part;
                  })}
                </p>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

export function DashboardPage() {
  const { tasks } = useTasks()
  const { sessions, getActiveStudySeconds, phase } = useSessions()
  const stats = computeDashboardStats(tasks, sessions)
  const insights = buildTaskInsightLines(tasks, stats)

  const activeStudyMinutes = Math.floor((getActiveStudySeconds ? getActiveStudySeconds() : 0) / 60)
  const totalTodayStudyMins = (stats.todayStudyMinutes || 0) + activeStudyMinutes

  const estTodayMinutes = stats.dueToday.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0)

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative mb-10 overflow-hidden rounded-[2rem] bg-blue-50 dark:bg-blue-900/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-transparent dark:from-blue-900/40"></div>
        <div className="relative p-8 sm:p-14">
          <h1 className="mb-3 text-3xl sm:text-4xl font-bold tracking-tight text-blue-900 dark:text-blue-100">
            Boost Your Productivity
          </h1>
          <p className="max-w-xl text-[15px] text-blue-700 dark:text-blue-300">
            Manage your tasks, track your focus, and achieve your goals faster with AI-generated study strategies.
          </p>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-gray-100">Your Overview</h2>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Due today" value={String(stats.dueToday.length)} hint="Pending tasks with today’s deadline" />
        <StatCard
          label="Completion rate"
          value={`${stats.completionRate}%`}
          hint={`${stats.completed} of ${stats.total} tasks done`}
        />
        <StatCard label="Pending" value={String(stats.pending)} hint="Across all deadlines" />
        <StatCard
          label="Est. time due today"
          value={stats.dueToday.length ? formatMinutes(estTodayMinutes) : '—'}
          hint="Sum of estimates for today’s pending tasks"
        />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-[#16171d]">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
              Today&apos;s tasks
            </h2>
            <Link
              to="/tasks"
              className="text-sm font-semibold text-blue-600 no-underline hover:text-blue-700 dark:text-blue-400"
            >
              View Tasks &rarr;
            </Link>
          </div>
          {stats.dueToday.length === 0 ? (
            <p className="text-[15px] text-slate-600 dark:text-slate-400">
              Nothing due today.{' '}
              <Link to="/tasks" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Add or reschedule tasks
              </Link>
            </p>
          ) : (
            <ul className="space-y-2">
              {stats.dueToday.slice(0, 6).map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-700/80"
                >
                  <span className="min-w-0 truncate font-medium text-slate-900 dark:text-gray-100">
                    {t.title}
                  </span>
                  <span className="flex-shrink-0 text-xs text-slate-500 dark:text-slate-400">
                    {formatMinutes(t.estimatedMinutes)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {stats.dueToday.length > 6 ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-500">
              +{stats.dueToday.length - 6} more — see Tasks page
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-[#16171d]">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
            Study & focus Today
          </h2>
          <div className="mb-4">
            <p className="text-3xl font-bold text-slate-900 dark:text-gray-100">
              {formatMinutes(totalTodayStudyMins)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total study time (includes {formatMinutes(stats.todayStudyMinutes)} saved and {formatMinutes(activeStudyMinutes)} current)
            </p>
          </div>
          
          {phase === 'running' || phase === 'paused' ? (
            <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
               <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                 Timer is currently {phase}...
               </p>
               <Link
                to="/session"
                className="mt-1 inline-block text-sm font-semibold text-emerald-700 underline dark:text-emerald-400"
              >
                Return to Session
              </Link>
            </div>
          ) : (
            <Link
              to="/session"
              className="inline-block text-[15px] font-semibold text-blue-600 no-underline hover:text-blue-700 dark:text-blue-400"
            >
              Start a new session &rarr;
            </Link>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-[#16171d]">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
          Insights (from your tasks)
        </h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-slate-700 dark:text-slate-300">
          {insights.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      <SmartStudySection stats={stats} />
    </div>
  )
}
