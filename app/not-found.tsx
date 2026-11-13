import SitePage from './site/SitePage'
import { NOT_FOUND_HTML } from './site/not-found'

export const metadata = { title: 'Maison Sanguine', robots: { index: false } }

export default function NotFound() {
  return <SitePage html={NOT_FOUND_HTML} />
}
