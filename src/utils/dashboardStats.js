import { getWeekRange, isDateInLocalRange, toYyyyMmDd } from './taskDates.js'

/**
 * @param {Array<{ status: string, deadline?: string }>} tasks
 * @param {Date} [now]
 */
export function computeDashboardStats(tasks, sessions = [], now = new Date()) {
  const todayStr = toYyyyMmDd(now)
  const { start: weekStart, end: weekEnd } = getWeekRange(now)

  const total = tasks.length
  const completed = tasks.filter((t) => t.status === 'completed').length
  const pending = total - completed
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)

  const dueToday = tasks.filter(
    (t) => t.status === 'pending' && t.deadline === todayStr,
  )

  const dueThisWeekPending = tasks.filter(
    (t) =>
      t.status === 'pending' &&
      t.deadline &&
      isDateInLocalRange(t.deadline, weekStart, weekEnd),
  )

  const overdue = tasks.filter(
    (t) => t.status === 'pending' && t.deadline && t.deadline < todayStr,
  )

  const todaySessions = sessions.filter(
    (s) => toYyyyMmDd(new Date(s.date)) === todayStr
  )
  const todayStudyMinutes = todaySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)

  return {
    todayStr,
    total,
    completed,
    pending,
    completionRate,
    dueToday,
    dueThisWeekPending,
    overdue,
    todayStudyMinutes,
  }
}

/**
 * @param {Array<{ status: string, deadline?: string }>} tasks
 * @param {ReturnType<typeof computeDashboardStats>} stats
 */
export function buildTaskInsightLines(tasks, stats) {
  const lines = []
  if (tasks.length === 0) {
    lines.push('Add tasks on the Tasks page to see insights here.')
    return lines
  }
  lines.push(
    `${stats.completionRate}% of tasks completed overall (${stats.completed}/${stats.total}).`,
  )
  if (stats.overdue.length > 0) {
    lines.push(`You have ${stats.overdue.length} overdue task(s)—consider rescheduling or breaking them down.`)
  }
  if (stats.dueToday.length > 0) {
    lines.push(`${stats.dueToday.length} task(s) due today.`)
  } else if (stats.pending > 0) {
    lines.push('Nothing due today—good window to work ahead on upcoming deadlines.')
  }
  if (stats.dueThisWeekPending.length > 1) {
    lines.push(
      `${stats.dueThisWeekPending.length} pending task(s) due this week—spread work across days to avoid crunch.`,
    )
  }
  return lines
}
