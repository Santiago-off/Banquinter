export function constantTimeEqual(a: string, b: string) {
  const len = Math.max(a.length, b.length)
  let res = 0
  for (let i = 0; i < len; i++) {
    const ca = a.charCodeAt(i) || 0
    const cb = b.charCodeAt(i) || 0
    res |= ca ^ cb
  }
  return res === 0 && a.length === b.length
}
