import { randomInt } from 'crypto'

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function block(n: number) {
  let s = ''
  for (let i = 0; i < n; i++) s += ALPHABET[randomInt(ALPHABET.length)]
  return s
}

export function invitationCode(slug: string, date?: string | null) {
  const prefix = slug.replace(/[^a-z]/gi, '').slice(0, 3).toUpperCase() || 'MSN'
  const year = date ? String(new Date(date).getFullYear()).slice(2) : ''
  return `MS-${prefix}${year}-${block(4)}-${block(4)}`
}
