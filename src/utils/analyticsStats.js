import { getWeekRange, toYyyyMmDd } from './taskDates.js'

/**
 * Returns chart data for the last 7 days of study times and focus trends.
 * @param {Array} sessions
 * @param {Date} [now]
 */
export function getWeeklyChartData(sessions, now = new Date()) {
  const data = []
  
  // Go back 6 days + today = 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = toYyyyMmDd(d)
    
    // Find sessions for this date
    const daySessions = sessions.filter(s => {
      if (!s.date) return false
      return toYyyyMmDd(new Date(s.date)) === dateStr
    })
    
    const studyMinutes = daySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)
    
    let focusSum = 0
    let focusCount = 0
    daySessions.forEach(s => {
      if (s.focusRating) {
        focusSum += s.focusRating
        focusCount++
      }
    })
    const avgFocus = focusCount > 0 ? (focusSum / focusCount).toFixed(1) : 0
    
    data.push({
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: dateStr,
      studyMinutes,
      avgFocus: Number(avgFocus)
    })
  }
  
  return data
}

/**
 * Returns chart data comparing task estimates vs actual study times.
 * @param {Array} tasks
 * @param {Array} sessions
 */
export function getEstimatesVsActuals(tasks, sessions) {
  const data = []
  
  // Only consider completed tasks or tasks that have an estimate and some sessions logged
  tasks.forEach(task => {
    // If it has no estimate, or no title, skip for graph clarity if we want, 
    // but let's just include ones that have estimates > 0
    if (!task.estimatedMinutes) return
    
    const taskSessions = sessions.filter(s => s.taskId === task.id)
    if (taskSessions.length === 0 && task.status !== 'completed') return // Skip pending tasks with no work
    
    const actualMinutes = taskSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)
    
    data.push({
      title: task.title.length > 15 ? task.title.substring(0, 15) + '...' : task.title,
      estimated: task.estimatedMinutes,
      actual: actualMinutes
    })
  })
  
  // Return top 10 most recent or most time-consuming to avoid cluttering the chart
  return data.slice(-10)
}
