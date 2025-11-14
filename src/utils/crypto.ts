export async function sha256Hex(input: string) {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(input))
  const arr = Array.from(new Uint8Array(buf))
  return arr.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function randomKey(length = 24) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const out: string[] = []
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  for (let i = 0; i < length; i++) out.push(alphabet[bytes[i] % alphabet.length])
  return out.join('')
}

export async function pbkdf2Hex(password: string, salt: string, iterations = 120000, length = 32) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations }, key, length * 8)
  const arr = Array.from(new Uint8Array(bits))
  return arr.map(b => b.toString(16).padStart(2, '0')).join('')
}
