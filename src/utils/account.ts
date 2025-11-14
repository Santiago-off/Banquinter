export function generateAccountNumber() {
  const prefix = 'BQ'
  const digits = new Uint8Array(18)
  crypto.getRandomValues(digits)
  const body = Array.from(digits).map(d => (d % 10).toString()).join('')
  let sum = 0
  for (let i = 0; i < body.length; i++) sum = (sum + Number(body[i])) % 97
  const checksum = (97 - sum).toString().padStart(2, '0')
  return `${prefix}${checksum}${body}`
}
