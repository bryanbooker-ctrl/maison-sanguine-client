import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import { HOJ_HTML, HOJ_APP } from '../../site/jubilation'
import '../../site/jubilation.css'

export const metadata: Metadata = {
  title: 'House of Jubilation | Maison Sanguine',
  description: 'Step inside the House of Jubilation and explore the rooms of Maison Sanguine.',
}

const SCRIPTS = [HOJ_APP]

export default function HouseOfJubilation() {
  return <SitePage html={HOJ_HTML} scripts={SCRIPTS} />
}
