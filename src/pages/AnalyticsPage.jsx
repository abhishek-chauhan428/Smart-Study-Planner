import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, ZAxis
} from 'recharts'
import { useTasks } from '../hooks/useTasks.js'
import { useSessions } from '../hooks/useSessions.js'
import { getWeeklyChartData, getEstimatesVsActuals } from '../utils/analyticsStats.js'

function ChartCard({ title, children, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-slate-700 dark:bg-[#16171d] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
        {title}
      </h2>
      {description && <p className="mb-4 mt-1 text-xs text-slate-500">{description}</p>}
      <div className="mt-4 h-[300px] w-full">
        {children}
      </div>
    </div>
  )
}

export function AnalyticsPage() {
  const { tasks } = useTasks()
  const { sessions } = useSessions()

  const weeklyData = useMemo(() => getWeeklyChartData(sessions), [sessions])
  const estimatesData = useMemo(() => getEstimatesVsActuals(tasks, sessions), [tasks, sessions])

  const hasSessions = sessions.length > 0
  const hasEstimatesData = estimatesData.length > 0

  return (
    <div>
      <h1 className="mb-2 text-[1.75rem] font-semibold text-slate-900 dark:text-gray-100">
        Analytics
      </h1>
      <p className="mb-6 max-w-[52ch] text-slate-600 dark:text-slate-400">
        Visualize your study habits, focus trends, and task completion accuracy over time.
      </p>

      {!hasSessions && (
        <div className="mb-6 rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-8 text-center text-sm text-slate-600 dark:border-slate-600 dark:bg-[#16171d]/60 dark:text-slate-400">
          No study sessions logged yet. Complete some sessions to see your data!
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Study Time */}
        <ChartCard 
          title="Weekly Study Time" 
          description="Total minutes studied over the last 7 days."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <RechartsTooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="studyMinutes" name="Minutes" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Focus Trend */}
        <ChartCard 
          title="Focus Trend" 
          description="Average focus rating (1-5) over the last 7 days."
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="avgFocus" name="Avg Focus" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Estimates vs Actuals */}
        <div className="lg:col-span-2">
          <ChartCard 
            title="Estimates vs. Actuals" 
            description="Comparing your estimated time vs actual time spent on tasks. Points below the line mean you finished faster than expected!"
          >
            {!hasEstimatesData ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Log sessions linked to estimated tasks to see this chart.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis 
                    type="number" 
                    dataKey="estimated" 
                    name="Estimated" 
                    unit="m" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    label={{ value: 'Estimated Time (mins)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="actual" 
                    name="Actual" 
                    unit="m" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    label={{ value: 'Actual Time (mins)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
                  />
                  <ZAxis type="category" dataKey="title" name="Task" />
                  <RechartsTooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Scatter name="Tasks" data={estimatesData} fill="#f59e0b" />
                  {/* Reference line x=y (where estimated == actual) */}
                  <Line dataKey="actual" data={[{estimated: 0, actual: 0}, {estimated: 300, actual: 300}]} stroke="#94a3b8" strokeDasharray="3 3" legendType="none" tooltipType="none" />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
