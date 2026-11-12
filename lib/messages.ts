import EN from '@/messages/en.json'
import FR from '@/messages/fr.json'
import ES from '@/messages/es.json'
import PT from '@/messages/pt.json'
import DE from '@/messages/de.json'
import IT from '@/messages/it.json'
import JA from '@/messages/ja.json'
import KO from '@/messages/ko.json'
import RU from '@/messages/ru.json'
import ZH_HANT from '@/messages/zh-hant.json'
import ZH_HANS from '@/messages/zh-hans.json'

export type Messages = Record<string, Record<string, string>>

export const SOURCE: Messages = EN as Messages

export const TRANSLATIONS: Record<string, Messages> = {
  fr: FR as Messages,
  es: ES as Messages,
  pt: PT as Messages,
  de: DE as Messages,
  it: IT as Messages,
  ja: JA as Messages,
  ko: KO as Messages,
  ru: RU as Messages,
  'zh-hant': ZH_HANT as Messages,
  'zh-hans': ZH_HANS as Messages,
}
