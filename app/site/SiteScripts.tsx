'use client'

import { useEffect } from 'react'
import { SITE_SCRIPTS } from './site-scripts'

const OVERLAYS = '.ms-col-bk,.ms-col-fp,.ms-col-bar,.ms-col-cv'

export default function SiteScripts({ extra = [] }: { extra?: string[] }) {
  useEffect(() => {
    const nodes = [...SITE_SCRIPTS, ...extra].map(code => {
      const s = document.createElement('script')
      s.text = code
      document.body.appendChild(s)
      return s
    })
    return () => {
      nodes.forEach(n => n.remove())
      document.querySelectorAll(OVERLAYS).forEach(n => n.remove())
      document.documentElement.classList.remove('ms-col-lock', 'ms-col-gut')
    }
  }, [extra])
  return null
}
