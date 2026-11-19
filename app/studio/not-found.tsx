import SitePage from '../site/SitePage'
import { STUDIO_CHROME_APP } from '../site/studio'
import { STUDIO_404_HTML } from '../site/studio-404'
import '../site/studio.css'

export const metadata = { title: 'Maison Sanguine Studio', robots: { index: false } }

export default function StudioNotFound() {
  return (
    <>
      <title>Maison Sanguine Studio</title>
      <SitePage html={STUDIO_404_HTML} scripts={[STUDIO_CHROME_APP]} />
    </>
  )
}
