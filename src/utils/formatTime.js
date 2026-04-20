/**
 * @param {number} minutes * @returns {string}
 */
export function formatMinutes(minutes) {
  if (!Number.isFinite(minutes) || minutes < 0) return '0m'
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}
