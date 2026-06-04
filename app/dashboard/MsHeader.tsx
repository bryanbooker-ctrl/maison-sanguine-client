'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function MsHeader() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut()
      router.push('/auth/login')
    }

    // Logout buttons
    document.getElementById('ms-logout-desk')?.addEventListener('click', logout)
    document.getElementById('ms-logout-mob')?.addEventListener('click', logout)
    document.getElementById('ms-logout-menu')?.addEventListener('click', logout)

    // Desktop mega menu
    const hdr = document.getElementById('msh')
    const menu = document.getElementById('msm')
    const ov = document.getElementById('msm-ov')
    const navItems = document.querySelectorAll('#ms-header-inject .msh-nav-item[data-panel]')
    const panels: Record<string, HTMLElement | null> = {
      season: document.getElementById('p-season'),
      world: document.getElementById('p-world')
    }
    const ORDER = ['season', 'world']
    let active: string | null = null
    let ctTimer: ReturnType<typeof setTimeout> | null = null
    let closeT: ReturnType<typeof setTimeout> | null = null

    function revealPanel(key: string, prev: string | null) {
      if (prev && panels[prev]) {
        panels[prev]!.classList.remove('visible')
        panels[prev]!.style.cssText = 'transition:opacity .16s ease;opacity:0;pointer-events:none'
      }
      const inn = panels[key]
      if (!inn) return
      inn.style.cssText = 'transition:none;opacity:0;pointer-events:none'
      requestAnimationFrame(() => requestAnimationFrame(() => {
        inn.style.cssText = 'transition:opacity .36s ease;opacity:1;pointer-events:auto'
        inn.classList.add('visible')
      }))
    }

    function openMenu(key: string) {
      if (ctTimer) clearTimeout(ctTimer)
      if (closeT) clearTimeout(closeT)
      const prev = active; active = key
      hdr?.classList.add('on')
      navItems.forEach(n => (n as HTMLElement).classList.toggle('on', (n as HTMLElement).dataset.panel === key))
      if (prev) { revealPanel(key, prev) } else {
        if (menu) { menu.style.display = 'block'; menu.setAttribute('aria-hidden', 'false') }
        ov?.classList.add('show')
        requestAnimationFrame(() => requestAnimationFrame(() => menu?.classList.add('opening')))
        ctTimer = setTimeout(() => { if (active === key) revealPanel(key, null) }, 1600)
      }
    }

    function closeMenu() {
      if (!active) return
      if (ctTimer) clearTimeout(ctTimer)
      active = null
      Object.values(panels).forEach(p => {
        if (!p) return
        p.classList.remove('visible')
        p.style.cssText = 'transition:none;opacity:0;pointer-events:none'
      })
      menu?.classList.remove('opening')
      menu?.setAttribute('aria-hidden', 'true')
      ov?.classList.remove('show')
      hdr?.classList.remove('on')
      navItems.forEach(n => (n as HTMLElement).classList.remove('on'))
      closeT = setTimeout(() => { if (!active && menu) menu.style.display = 'none' }, 1360)
    }

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        const key = (item as HTMLElement).dataset.panel!
        active === key ? closeMenu() : openMenu(key)
      })
    })
    ov?.addEventListener('click', closeMenu)

    // Mobile menu
    const mobHdr = document.getElementById('msm-mob')
    const mobMenu = document.getElementById('mob-menu')
    const burger = document.getElementById('ms-mob-burger')
    const mobClose = document.getElementById('ms-mob-close')
    let mobOpen = false
    let mobCtTimer: ReturnType<typeof setTimeout> | null = null

    function openMob() {
      mobOpen = true
      if (mobMenu) { mobMenu.style.display = 'block'; mobMenu.setAttribute('aria-hidden', 'false') }
      document.body.style.overflow = 'hidden'
      mobHdr?.classList.add('menu-open')
      requestAnimationFrame(() => mobMenu?.classList.add('open'))
      mobCtTimer = setTimeout(() => mobMenu?.classList.add('content-vis'), 1600)
    }

    function closeMob() {
      mobOpen = false
      if (mobCtTimer) clearTimeout(mobCtTimer)
      mobHdr?.classList.remove('menu-open', 'sub-open')
      document.body.style.overflow = ''
      document.querySelectorAll('#ms-header-inject .mob-sub.open').forEach(s => {
        s.classList.remove('open'); s.setAttribute('aria-hidden', 'true')
      })
      mobMenu?.classList.remove('open', 'content-vis')
      mobMenu?.setAttribute('aria-hidden', 'true')
      setTimeout(() => { if (!mobOpen && mobMenu) mobMenu.style.display = 'none' }, 1360)
    }

    burger?.addEventListener('click', () => mobOpen ? closeMob() : openMob())
    mobClose?.addEventListener('click', closeMob)

    // Mobile submenus
    function openSub(id: string) {
      const s = document.getElementById(id)
      if (!s) return
      s.setAttribute('aria-hidden', 'false'); s.classList.add('open')
      mobHdr?.classList.remove('menu-open'); mobHdr?.classList.add('sub-open')
    }
    function closeSub(el: Element) { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true') }

    document.getElementById('ms-season-trig')?.addEventListener('click', () => openSub('mob-sub-season'))
    document.getElementById('ms-world-trig')?.addEventListener('click', () => openSub('mob-sub-world'))

    document.querySelectorAll('#ms-header-inject [data-sub-back]').forEach(b => {
      b.addEventListener('click', () => {
        const s = b.closest('.mob-sub'); if (s) closeSub(s)
        mobHdr?.classList.remove('sub-open'); mobHdr?.classList.add('menu-open')
      })
    })

    return () => {
      closeMenu(); closeMob()
    }
  }, [])

  return null
}
