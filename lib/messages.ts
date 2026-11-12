import EN from '@/messages/en.json'
import FR from '@/messages/fr.json'

export type Messages = Record<string, Record<string, string>>

export const SOURCE: Messages = EN as Messages

export const TRANSLATIONS: Record<string, Messages> = {
  fr: FR as Messages,
}
