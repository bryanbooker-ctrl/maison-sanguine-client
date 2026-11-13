'use client'

import { memo, useEffect } from 'react'
import { MS_CSS } from './chrome'
import { LANG_CSS, LANG_SCRIPT } from './lang'
import MenuSession from './MenuSession'

declare global {
  interface Window { __msChrome?: boolean }
}

function SiteChrome({ data, scripts, menu }: { data: string; scripts: string[]; menu?: Record<string, string> }) {
  useEffect(() => {
    if (window.__msChrome) return
    window.__msChrome = true
    ;[...scripts, LANG_SCRIPT].forEach(code => {
      const s = document.createElement('script')
      s.text = code
      document.body.appendChild(s)
    })
  }, [scripts])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MS_CSS + '\n' + LANG_CSS }} />
      <div hidden dangerouslySetInnerHTML={{ __html: data }} />
      <div id="ms-chrome-host" suppressHydrationWarning />
      <MenuSession dict={menu} />
    </>
  )
}

export default memo(SiteChrome)
