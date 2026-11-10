'use client'

import { useEffect } from 'react'
import { SITE_SCRIPTS } from './site-scripts'

export default function SiteScripts() {
  useEffect(() => {
    const nodes = SITE_SCRIPTS.map(code => {
      const s = document.createElement('script')
      s.text = code
      document.body.appendChild(s)
      return s
    })
    return () => nodes.forEach(n => n.remove())
  }, [])
  return null
}
