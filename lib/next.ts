export function safeNext(v?: string | null, fallback = '/dashboard') {
  if (!v || !v.startsWith('/') || v.startsWith('//') || v.startsWith('/\\') || v.startsWith('/auth')) return fallback
  return v
}
