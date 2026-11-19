const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

/** ₹15,000 — Indian grouping, no decimals. */
export function rupees(n: number): string {
  const sign = n < 0 ? '−' : ''
  return `${sign}₹${inr.format(Math.abs(Math.round(n)))}`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function dayLabel(iso: string, today: string): string {
  if (iso === today) return 'Today'
  const d = new Date(iso + 'T00:00:00')
  const t = new Date(today + 'T00:00:00')
  const diff = Math.round((t.getTime() - d.getTime()) / 86400000)
  if (diff === 1) return 'Yesterday'
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export function shortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}
