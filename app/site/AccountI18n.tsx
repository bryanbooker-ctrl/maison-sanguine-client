'use client'

import { useEffect } from 'react'

const DAYS: Record<string, string> = { Monday: 'lundi', Tuesday: 'mardi', Wednesday: 'mercredi', Thursday: 'jeudi', Friday: 'vendredi', Saturday: 'samedi', Sunday: 'dimanche' }
const MONTHS: Record<string, string> = { January: 'janvier', February: 'février', March: 'mars', April: 'avril', May: 'mai', June: 'juin', July: 'juillet', August: 'août', September: 'septembre', October: 'octobre', November: 'novembre', December: 'décembre' }
const DATE = /\b(?:(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+)?(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})\b/g
const ATTRS = ['placeholder', 'aria-label', 'title', 'alt']

export default function AccountI18n({ dict }: { dict: Record<string, string> }) {
  useEffect(() => {
    const norm = (s: string) => s.replace(/\s+/g, ' ').trim()
    const tr = (s: string) => {
      const k = norm(s)
      if (!k || !/[A-Za-z]/.test(k)) return s
      const v = dict[k]
      if (v) return s.replace(k, v)
      return s.replace(DATE, (_m, d, mo, day, y) => (d ? DAYS[d] + ' ' : '') + (day === '1' ? '1er' : day) + ' ' + MONTHS[mo] + ' ' + y)
    }
    const text = (n: Text) => {
      const p = n.parentElement
      if (!p || p.closest('script,style,#ms-chrome-host,#ms-foot')) return
      const v = tr(n.nodeValue || '')
      if (v !== n.nodeValue) n.nodeValue = v
    }
    const el = (e: Element) => {
      if (e.closest('#ms-chrome-host,#ms-foot')) return
      for (const a of ATTRS) {
        const v = e.getAttribute(a)
        if (v) { const t = tr(v); if (t !== v) e.setAttribute(a, t) }
      }
    }
    const scan = (root: Node) => {
      if (root.nodeType === 3) { text(root as Text); return }
      if (root.nodeType !== 1) return
      el(root as Element)
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT)
      let n: Node | null
      while ((n = w.nextNode())) n.nodeType === 3 ? text(n as Text) : el(n as Element)
    }
    scan(document.body)
    const mo = new MutationObserver(list => {
      for (const m of list) {
        if (m.type === 'characterData') text(m.target as Text)
        else if (m.type === 'attributes') el(m.target as Element)
        else m.addedNodes.forEach(scan)
      }
    })
    mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS })
    return () => mo.disconnect()
  }, [dict])
  return null
}
