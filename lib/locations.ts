// Locations of the site. Each location has a URL segment, a currency and the languages offered there.
// International has no country segment: its URLs start with /en.
// The first language of a location is the one chosen by default when it is translated (see LOCALES in lib/locales.ts).

export type Location = { code: string; currency: string; langs: string[] }

export const INTL = 'intl'

export const LOCATIONS: Location[] = [
  { code: INTL, currency: 'EUR', langs: ['en'] },
  { code: 'br', currency: 'BRL', langs: ['pt', 'en'] },
  { code: 'fr', currency: 'EUR', langs: ['fr', 'en'] },
  { code: 'de', currency: 'EUR', langs: ['de', 'en'] },
  { code: 'hk', currency: 'HKD', langs: ['en', 'zh-hant'] },
  { code: 'it', currency: 'EUR', langs: ['it', 'en'] },
  { code: 'jp', currency: 'JPY', langs: ['ja', 'en'] },
  { code: 'mo', currency: 'MOP', langs: ['zh-hant', 'en'] },
  { code: 'mx', currency: 'MXN', langs: ['es', 'en'] },
  { code: 'ru', currency: 'RUB', langs: ['ru', 'en'] },
  { code: 'kr', currency: 'KRW', langs: ['ko', 'en'] },
  { code: 'es', currency: 'EUR', langs: ['es', 'en'] },
  { code: 'tw', currency: 'TWD', langs: ['zh-hant', 'en'] },
  { code: 'gb', currency: 'GBP', langs: ['en'] },
  { code: 'us', currency: 'USD', langs: ['en'] },
]

// Countries shown in the list that use the International pages (English) with their own currency.
export const INTL_COUNTRIES: { region: string; currency: string; label?: string }[] = [
  { region: 'AU', currency: 'AUD' }, { region: 'CZ', currency: 'CZK', label: 'Czech Republic' },
  { region: 'AE', currency: 'AED', label: 'Dubai' }, { region: 'IL', currency: 'ILS' },
  { region: 'MY', currency: 'MYR' }, { region: 'NL', currency: 'EUR' },
  { region: 'SG', currency: 'SGD' }, { region: 'TH', currency: 'THB' },
]

export function intlCountry(region: string | undefined | null) {
  return INTL_COUNTRIES.find(c => c.region === region)
}

// Currency for a location context, and for International the country chosen in the window.
export function currencyOf(ctx: string, region?: string | null) {
  const loc = locOf(ctx)
  if (loc === INTL) return intlCountry(region)?.currency || 'EUR'
  return locationOf(loc)?.currency || 'EUR'
}

export const LANG_NAMES: Record<string, string> = {
  en: 'English', fr: 'Français', de: 'Deutsch', it: 'Italiano', es: 'Español', pt: 'Português',
  ko: '한국어', ja: '日本語', ru: 'Русский', 'zh-hant': '繁體中文',
}

export const LANGS = Object.keys(LANG_NAMES)

export function htmlLang(lang: string) {
  return lang === 'zh-hant' ? 'zh-Hant' : lang
}

export function locationOf(code: string) {
  return LOCATIONS.find(l => l.code === code)
}

export function prefixOf(loc: string, lang: string) {
  return loc === INTL ? 'en' : loc + '/' + lang
}

export function hreflangOf(loc: string, lang: string) {
  return loc === INTL ? 'en' : htmlLang(lang) + '-' + loc.toUpperCase()
}

// Reads "/fr/fr/..." or "/en/...". Returns the context ("fr/fr", "en") and the rest of the path.
export function parsePrefix(path: string): { ctx: string; loc: string; lang: string; rest: string } | null {
  if (path === '/en' || path.startsWith('/en/')) return { ctx: 'en', loc: INTL, lang: 'en', rest: path.slice(3) }
  const m = path.match(/^\/([a-z]{2})\/([a-z]{2}(?:-[a-z]{4})?)(?=\/|$)/)
  if (!m) return null
  const loc = locationOf(m[1])
  if (!loc || loc.code === INTL || !loc.langs.includes(m[2])) return null
  return { ctx: m[1] + '/' + m[2], loc: m[1], lang: m[2], rest: path.slice(m[0].length) }
}

export function isContext(ctx: string | undefined | null): ctx is string {
  return !!ctx && !!parsePrefix('/' + ctx)
}

export function langOf(ctx: string) {
  return ctx.split('/').pop() || 'en'
}

export function locOf(ctx: string) {
  return ctx.includes('/') ? ctx.split('/')[0] : INTL
}

// Any prefixed path, used to avoid prefixing a link twice.
export const PREFIX_RE = /^\/(?:en|[a-z]{2}\/[a-z]{2}(?:-[a-z]{4})?)(?=\/|$)/

// The home page is "/home" in public URLs and "/" inside the app.
export function homePath(path: string) {
  return !path || path === '/' ? '/home' : path
}
