type Window = { count: number; resetAt: number }
const KEY = 'banquinter:rate:login'

export function canAttemptLogin() {
  const now = Date.now()
  const raw = localStorage.getItem(KEY)
  const w: Window = raw ? JSON.parse(raw) : { count: 0, resetAt: now + 60_000 }
  if (now > w.resetAt) { w.count = 0; w.resetAt = now + 60_000 }
  const allowed = w.count < 5
  localStorage.setItem(KEY, JSON.stringify(w))
  return allowed
}

export function recordFailedAttempt() {
  const now = Date.now()
  const raw = localStorage.getItem(KEY)
  const w: Window = raw ? JSON.parse(raw) : { count: 0, resetAt: now + 60_000 }
  w.count++
  if (w.count >= 5) {
    // exponential backoff up to 15 minutes
    const penalty = Math.min(15 * 60_000, Math.pow(2, Math.floor(w.count / 5)) * 60_000)
    w.resetAt = now + penalty
  }
  localStorage.setItem(KEY, JSON.stringify(w))
}

export function resetRate() { localStorage.removeItem(KEY) }
