// Languages that have a translation file in messages/. English is the source language.
// To add a language: create messages/<code>.json, add the code below and its import in lib/messages.ts.
// A language offered in a location (lib/locations.ts) without a file here is shown in English.
export const LOCALES = ['en', 'fr', 'es', 'pt', 'de', 'it', 'ja', 'ko', 'ru', 'zh-hant', 'zh-hans'] as const
export const DEFAULT_LOCALE = 'en'
export const TRANSLATED: readonly string[] = LOCALES
