'use client'

import { useEffect } from 'react'

export default function LightHeader() {
  useEffect(() => {
    const r = document.documentElement
    const had = r.classList.contains('ms-hdr-dark')
    r.classList.remove('ms-hdr-dark')
    r.classList.add('ms-hdr-light')
    return () => {
      r.classList.remove('ms-hdr-light')
      if (had) r.classList.add('ms-hdr-dark')
    }
  }, [])
  return null
}
