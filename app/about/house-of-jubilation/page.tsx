import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { HOJ_HTML, HOJ_APP } from '../../site/jubilation'
import '../../site/jubilation.css'

const META: Metadata = {
  title: 'Maison Sanguine | House of Jubilation',
  description: 'Step inside the House of Jubilation and explore the rooms of Maison Sanguine.',
}

export const generateMetadata = () => localizeMetadata(META)

const HOJ_3D = "(function(){var r=document.getElementById('atelier-of-nights');if(!r||r.__s3)return;r.__s3=1;import('/hoj/scene.js?v=5').then(function(m){window.__hojScene=m.mount(r)}).catch(function(){})})()"

const SCRIPTS = [HOJ_APP, HOJ_3D]

export default function HouseOfJubilation() {
  return <SitePage html={HOJ_HTML} scripts={SCRIPTS} />
}
