'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type MSWindow = Window & { MS?: { menu?: { sections?: { title: string }[] } } }

const DEFAULT_TITLE = 'Welcome'

function waitFor(sel: string, cb: (el: Element) => void, tries = 60) {
  const el = document.querySelector(sel)
  if (el) { cb(el); return }
  if (tries > 0) setTimeout(() => waitFor(sel, cb, tries - 1), 100)
}

function findTile(kicker: string) {
  const ks = Array.from(document.querySelectorAll('#ms-menu .ms-drawer__kicker'))
  const k = ks.find(n => n.getAttribute('data-ms-kicker') === kicker || n.textContent?.trim() === kicker)
  return k ? (k.closest('.ms-drawer__link') as HTMLAnchorElement | null) : null
}

function setTile(a: HTMLAnchorElement, kicker: string, label: string, href: string) {
  const k = a.querySelector('.ms-drawer__kicker')
  const l = a.querySelector('.ms-drawer__label')
  if (k) {
    if (!k.getAttribute('data-ms-kicker')) k.setAttribute('data-ms-kicker', k.textContent?.trim() || '')
    k.textContent = kicker
  }
  if (l) {
    if (!l.getAttribute('data-ms-label')) l.setAttribute('data-ms-label', l.innerHTML)
    l.innerHTML = '<span></span>'
    ;(l.firstChild as HTMLElement).textContent = label
  }
  if (!a.getAttribute('data-ms-href')) a.setAttribute('data-ms-href', a.getAttribute('href') || '')
  a.setAttribute('href', href)
  a.removeAttribute('target')
  a.removeAttribute('rel')
}

function resetTile(a: HTMLAnchorElement) {
  const k = a.querySelector('.ms-drawer__kicker')
  const l = a.querySelector('.ms-drawer__label')
  if (k && k.getAttribute('data-ms-kicker')) k.textContent = k.getAttribute('data-ms-kicker')
  if (l && l.getAttribute('data-ms-label')) l.innerHTML = l.getAttribute('data-ms-label') || ''
  if (a.getAttribute('data-ms-href')) a.setAttribute('href', a.getAttribute('data-ms-href') || '')
  delete a.dataset.msLogout
}

function setTitle(text: string) {
  const sec = (window as MSWindow).MS?.menu?.sections
  if (sec && sec[0]) sec[0].title = text
  const on = document.querySelector('#ms-menu .ms-drawer__title-text.is-on')
  const first = document.querySelectorAll('#ms-menu .ms-drawer__title-text')
  const cur = on?.textContent?.trim().toLowerCase()
  if (on && (cur === DEFAULT_TITLE.toLowerCase() || cur?.startsWith(DEFAULT_TITLE.toLowerCase() + ','))) on.textContent = text
  else if (!on && first[0]) first[0].textContent = text
}

export default function MenuSession() {
  useEffect(() => {
    const supabase = createClient()
    let alive = true

    const logout = async (e: Event) => {
      const a = (e.target as Element).closest('a[data-ms-logout]')
      if (!a) return
      e.preventDefault()
      e.stopPropagation()
      await supabase.auth.signOut()
      window.location.href = '/auth/login'
    }
    document.addEventListener('click', logout, true)

    const apply = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!alive) return
      waitFor('#ms-menu .ms-drawer__kicker', async () => {
        const next = findTile('Upcoming Night')
        const account = findTile('My MS')

        if (!user) {
          setTitle(DEFAULT_TITLE)
          if (next) resetTile(next)
          if (account) resetTile(account)
          return
        }

        const [{ data: p }, { data: r }] = await Promise.all([
          supabase.from('profiles').select('first_name').eq('id', user.id).single(),
          supabase.from('reservations').select('experience_name, experience_date').eq('user_id', user.id)
            .gte('experience_date', new Date().toISOString().slice(0, 10))
            .order('experience_date', { ascending: true }).limit(1),
        ])
        if (!alive) return

        const name = (p?.first_name || '').trim()
        setTitle(name ? `${DEFAULT_TITLE}, ${name}` : DEFAULT_TITLE)

        if (next && r && r[0]) setTile(next, 'Your Next Night', r[0].experience_name, '/dashboard?tab=experiences')
        else if (next) resetTile(next)

        if (account) {
          setTile(account, 'My MS', 'Log out', '/auth/login')
          account.dataset.msLogout = '1'
        }
      })
    }

    apply()
    const { data: sub } = supabase.auth.onAuthStateChange(() => { apply() })

    return () => {
      alive = false
      document.removeEventListener('click', logout, true)
      sub.subscription.unsubscribe()
    }
  }, [])

  return null
}
