import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import { editionPrices } from '@/lib/mc-prices'
import SitePage from '../../../site/SitePage'
import { STUDIO_CHROME_APP } from '../../../site/studio'
import { STUDIO_MC_HTML } from '../../../site/studio-mc'
import { MC_PAGE_APP } from '../../../site/masterclass-pages'
import '../../../site/masterclass.css'
import '../../../site/studio.css'

const META: Metadata = {
  title: 'Maison Sanguine Studio | Masterclass: The Making of a Night',
  description: 'Follow the making of a night at the Maison Sanguine Studio, from the first sketches to the final staging, alongside the artists and creators of the Maison.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [STUDIO_CHROME_APP, MC_PAGE_APP]

export default async function MakingOfANight() {
  const price = await editionPrices(['mc-the-making-of-a-night-paris'])
  const html = STUDIO_MC_HTML + `<script type="application/json" id="mc-prices">${JSON.stringify(price).replace(/</g, '\\u003c')}</script>`
  return <SitePage html={html} scripts={SCRIPTS} h1="Masterclass: The Making of a Night, Maison Sanguine Studio" />
}
