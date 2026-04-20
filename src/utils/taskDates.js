/** @param {Date} [ref] */
export function toYyyyMmDd(ref = new Date()) {
  const d = ref
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Monday–Sunday week in local time. @param {Date} [ref] */
export function getWeekRange(ref = new Date()) {
  const r = new Date(ref)
  const day = r.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(r)
  monday.setDate(r.getDate() + mondayOffset)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return { start: monday, end: sunday }
}

/** @param {string} yyyyMmDd */
export function parseLocalDate(yyyyMmDd) {
  const [y, m, d] = yyyyMmDd.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** @param {string} yyyyMmDd @param {Date} start @param {Date} end */
export function isDateInLocalRange(yyyyMmDd, start, end) {
  const t = parseLocalDate(yyyyMmDd).getTime()
  return t >= start.getTime() && t <= end.getTime()
}
