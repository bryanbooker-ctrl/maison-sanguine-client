// Languages of the site. English is the default and has no URL prefix.
// To add a language: create messages/<code>.json, add the code below and its import in lib/messages.ts.
export const LOCALES = ['en', 'fr'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
export const PREFIXED: readonly string[] = LOCALES.filter(l => l !== DEFAULT_LOCALE)
