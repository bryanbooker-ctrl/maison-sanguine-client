import { headers } from 'next/headers'
import { DEFAULT_LOCALE, LOCALES, TRANSLATED } from './locales'
import { SOURCE as EN, TRANSLATIONS as SOURCES, type Messages } from './messages'
import { LOCATIONS, PREFIX_RE, homePath, hreflangOf, isContext, langOf, prefixOf } from './locations'

export { DEFAULT_LOCALE, LOCALES }

// A locale here is the location context of the URL: "en" (International) or "<country>/<language>", like "fr/fr".
export type Locale = string

export function norm(s: string) {
  return s.replace(/\s+/g, ' ').trim()
}

export function textKey(s: string) {
  let h = 0x811c9dc5
  const t = norm(s)
  for (let i = 0; i < t.length; i++) {
    h ^= t.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(36).padStart(7, '0')
}

function flatten(m: Messages) {
  const out: Record<string, string> = {}
  for (const [name, ns] of Object.entries(m)) if (name !== 'account') for (const [k, v] of Object.entries(ns)) if (v) out[k] = v
  return out
}

const EN_FLAT = flatten(EN)
const FLAT: Record<string, Record<string, string>> = Object.fromEntries(Object.entries(SOURCES).map(([l, m]) => [l, flatten(m)]))

export async function getLocale(): Promise<Locale> {
  const h = await headers()
  const l = h.get('x-ms-locale')
  return isContext(l) ? l : DEFAULT_LOCALE
}

function translatable(locale: Locale) {
  const lang = langOf(locale)
  return lang !== DEFAULT_LOCALE && !!FLAT[lang]
}

export async function getPublicPath(): Promise<string> {
  const h = await headers()
  return h.get('x-ms-path') || '/'
}

export function tc(prev: string, text: string, locale: Locale): string {
  if (prev && translatable(locale)) {
    const key = textKey(prev + ' || ' + norm(text))
    const v = FLAT[langOf(locale)]?.[key]
    if (v && EN_FLAT[key] !== undefined) return text.match(/^\s*/)![0] + v + text.match(/\s*$/)![0]
  }
  return t(text, locale)
}

export function t(text: string, locale: Locale): string {
  if (!text || !translatable(locale) || !/[A-Za-z]/.test(text)) return text
  const key = textKey(text)
  const v = FLAT[langOf(locale)]?.[key]
  if (!v || EN_FLAT[key] === undefined) return text
  const lead = text.match(/^\s*/)![0]
  const trail = text.match(/\s*$/)![0]
  return lead + v + trail
}

const OWN_HOST = /^https?:\/\/((?:www|careers|press|msarchives)\.)?maisonsanguine\.com(?=\/|$|[?#])/i
const SKIP_PATH = /^\/(?:api|_next|auth\/callback)(?:\/|$)|\.[a-z0-9]{2,4}$/i

export function localizeHref(href: string, locale: Locale): string {
  if (!href) return href
  const abs = href.match(OWN_HOST)
  if (abs) {
    const [, path = '', suffix = ''] = href.slice(abs[0].length).match(/^([^?#]*)(.*)$/) || []
    if (path && (SKIP_PATH.test(path) || PREFIX_RE.test(path))) return href
    return abs[0] + '/' + locale + homePath(path) + suffix
  }
  if (href.startsWith('/') && !href.startsWith('//')) {
    const path = href.match(/^[^?#]*/)![0]
    if (SKIP_PATH.test(path) || PREFIX_RE.test(path)) return href
    return '/' + locale + homePath(path) + href.slice(path.length)
  }
  return href
}

export function trData<T>(value: T, locale: Locale): T {
  if (typeof value === 'string') return t(value, locale) as T
  if (Array.isArray(value)) return value.map(v => trData(v, locale)) as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = /^(href|url|link|src|id|key|slug|img|image|video|lat|lng)$/i.test(k) && typeof v === 'string' ? localizeLinkLike(k, v, locale) : trData(v, locale)
    return out as T
  }
  return value
}

function localizeLinkLike(k: string, v: string, locale: Locale) {
  return /^(href|url|link)$/i.test(k) ? localizeHref(v, locale) : v
}

const ATTRS = /(\s(?:alt|aria-label|placeholder|title|data-a|data-b|data-label)=")([^"]*)(")/g
const HREF = /(\shref=")([^"]*)(")/g

function trTag(tag: string, locale: Locale) {
  return tag.replace(ATTRS, (_, a, v, b) => a + t(v, locale) + b).replace(HREF, (_, a, v, b) => a + localizeHref(v, locale) + b)
}

function trFragment(html: string, locale: Locale) {
  return html
    .replace(ATTRS, (_, a, v, b) => a + t(v, locale) + b)
    .replace(/^([^<>"=]+)(?=<)/, (_, x) => t(x, locale))
    .replace(/>([^<>]+)(?=<|$)/g, (_, x) => '>' + t(x, locale))
}

const cache = new Map<string, string>()

export function trHtml(html: string, locale: Locale): string {
  if (!html) return html
  const ck = locale + '\u0000' + html
  const hit = cache.get(ck)
  if (hit !== undefined) return hit
  let prev = ''
  const out = html
    .split(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[\s\S]*?-->|<[^>]+>)/g)
    .map(p => {
      if (!p) return p
      if (p.startsWith('<script')) {
        const m = p.match(/^(<script\b[^>]*>)([\s\S]*?)(<\/script>)$/)!
        if (/type=["']application\/(?:ld\+)?json["']/.test(m[1])) {
          try {
            return m[1] + JSON.stringify(trData(JSON.parse(m[2]), locale)).replace(/<\//g, '<\\/') + m[3]
          } catch {
            return p
          }
        }
        return m[1] + trJs(m[2], locale) + m[3]
      }
      if (p.startsWith('<style') || p.startsWith('<!--')) return p
      if (p.startsWith('<')) return trTag(p, locale)
      if (!/[A-Za-z]/.test(p)) return p
      const out = tc(prev, p, locale)
      prev = norm(p)
      return out
    })
    .join('')
  cache.set(ck, out)
  return out
}

export function trJs(code: string, locale: Locale): string {
  if (!code || !translatable(locale)) return code
  locale = langOf(locale)
  const ck = locale + '\u0001' + code
  const hit = cache.get(ck)
  if (hit !== undefined) return hit
  const out = code.replace(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"/g, (lit, sq, dq) => {
    const q = sq !== undefined ? "'" : '"'
    const body = sq ?? dq
    if (!/[A-Za-z]/.test(body) || /\\/.test(body)) return lit
    const next = body.includes('<') ? trFragment(body, locale) : t(body, locale)
    if (next === body) return lit
    return q + next.split(q).join('\\' + q) + q
  })
  cache.set(ck, out)
  return out
}

export async function localizeMetadata<M extends { title?: unknown; description?: unknown }>(meta: M): Promise<M & { alternates: { canonical: string; languages: Record<string, string> } }> {
  const h = await headers()
  const locale = await getLocale()
  const host = h.get('host') || 'maisonsanguine.com'
  const path = homePath(h.get('x-ms-path') || '/')
  const origin = (/^(localhost|127\.)/.test(host) ? 'http://' : 'https://') + host
  const languages: Record<string, string> = {}
  for (const l of LOCATIONS) for (const lang of l.langs) if (TRANSLATED.includes(lang)) languages[hreflangOf(l.code, lang)] = origin + '/' + prefixOf(l.code, lang) + path
  const intl = origin + '/en' + path
  return {
    ...meta,
    title: typeof meta.title === 'string' ? t(meta.title, locale) : meta.title,
    description: typeof meta.description === 'string' ? t(meta.description, locale) : meta.description,
    alternates: { canonical: TRANSLATED.includes(langOf(locale)) ? origin + '/' + locale + path : intl, languages: { ...languages, 'x-default': intl } },
  }
}

export function accountDict(locale: Locale): Record<string, string> {
  const src = (SOURCES[langOf(locale)]?.account || {}) as Record<string, string>
  const en = EN.account || {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(src)) if (en[k] && v) out[en[k]] = v
  return out
}
