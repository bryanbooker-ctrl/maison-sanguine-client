import SitePage from '../../site/SitePage'
import { INITIATIVE_HTML } from '../../site/initiative'
import '../../site/initiative.css'

export const metadata = { title: 'Maison Sanguine | Initiative', robots: { index: false } }

export default function Page() {
  return <SitePage html={INITIATIVE_HTML} />
}
