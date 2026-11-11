'use client'

import { useEffect } from 'react'
import { SITE_SCRIPTS } from './site-scripts'
import { FIT_SCRIPT } from './fit'

const OVERLAYS = '.ms-col-bk,.ms-col-fp,.ms-col-bar,.ms-col-cv,.ms-pop'

export default function SiteScripts({ extra = [] }: { extra?: string[] }) {
  useEffect(() => {
    const nodes = [...SITE_SCRIPTS, ...extra, FIT_SCRIPT].map(code => {
      const s = document.createElement('script')
      s.text = code
      document.body.appendChild(s)
      return s
    })
    return () => {
      nodes.forEach(n => n.remove())
      document.querySelectorAll(OVERLAYS).forEach(n => n.remove())
      document.documentElement.classList.remove('ms-col-lock', 'ms-col-gut')
      document.documentElement.style.overflow = ''
      delete (window as unknown as { __msHouse?: string | null }).__msHouse
    }
  }, [extra])
  return null
}
