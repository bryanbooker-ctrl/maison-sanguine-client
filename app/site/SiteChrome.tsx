'use client'

import { memo, useEffect } from 'react'
import { MS_CSS, MS_DATA, MS_SCRIPTS } from './chrome'
import MenuSession from './MenuSession'

declare global {
  interface Window { __msChrome?: boolean }
}

function SiteChrome() {
  useEffect(() => {
    if (window.__msChrome) return
    window.__msChrome = true
    MS_SCRIPTS.forEach(code => {
      const s = document.createElement('script')
      s.text = code
      document.body.appendChild(s)
    })
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MS_CSS }} />
      <div hidden dangerouslySetInnerHTML={{ __html: MS_DATA }} />
      <div id="ms-chrome-host" suppressHydrationWarning />
      <MenuSession />
    </>
  )
}

export default memo(SiteChrome)
