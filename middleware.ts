import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { safeNext } from '@/lib/next'
import { TRANSLATED } from '@/lib/locales'
import { INTL, LANGS, homePath, isContext, locationOf, parsePrefix, prefixOf } from '@/lib/locations'

const PROTECTED = ['/dashboard', '/request', '/admin']

const PASS = ['/_next', '/api', '/favicon.ico']

const COOKIE = 'ms_loc'

function geoContext(country: string) {
  const c = country.toLowerCase()
  const loc = locationOf(c)
  if (!loc || loc.code === INTL) return 'en'
  const lang = loc.langs.find(l => TRANSLATED.includes(l)) || loc.langs[0]
  return prefixOf(loc.code, lang)
}

export async function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase()
  const search = request.nextUrl.search
  const raw = request.nextUrl.pathname
  const sub = /^(careers|press|msarchives)\./.test(host)

  if (PASS.some(p => raw === p || raw.startsWith(p + '/'))) return NextResponse.next()
  if (/\.[a-z0-9]{2,5}$/i.test(raw)) return NextResponse.next()

  const saved = request.cookies.get(COOKIE)?.value
  const preferred = isContext(saved) ? saved : geoContext(request.headers.get('x-vercel-ip-country') || '')
  const redirect = (target: string) => NextResponse.redirect(new URL(target + search, request.url))

  const bare = raw === '/auth/callback'
  const parsed = bare ? { ctx: preferred, rest: raw } : parsePrefix(raw)

  if (!parsed) {
    const seg = raw.match(/^\/([a-z]{2})(?:\/([a-z]{2}(?:-[a-z]{4})?))?(?=\/|$)/)
    const loc = seg && locationOf(seg[1])
    if (loc && seg![2] && LANGS.includes(seg![2])) return redirect('/' + prefixOf(loc.code, loc.langs[0]) + raw.slice(seg![0].length))
    if (seg && seg[1] === 'fr' && !seg[2]) {
      const rest = raw.slice(3)
      if (!sub && rest === '/home') return redirect('/fr/fr/careers')
      if (!sub && rest === '/opportunities') return redirect('/fr/fr/careers/opportunities')
      return redirect('/fr/fr' + homePath(rest))
    }
    return redirect('/' + preferred + homePath(raw))
  }

  const locale = parsed.ctx
  if (!bare && parsed.rest.replace(/\/$/, '') === '/about/sustainability') return redirect('/' + locale + '/about/commitments')
  const MOVED: Record<string, string> = {
    '/contact': '/form/contact-us',
    '/event/aspen-winter-edition': '/night-collection/winter-edition/saturday-february-20-2027',
    '/event/new-york-spring-edition': '/night-collection/spring-edition/monday-may-3-2027',
    '/night-collection/spring-edition/saturday-april-24-2027': '/night-collection/spring-edition/monday-may-3-2027',
    '/event/rite-of-summer-saint-tropez': '/night-collection/rite-of-summer/saturday-july-24-2027',
    '/event/msnye-2027-rio-de-janeiro': '/night-collection/msnye/friday-december-31-2027',
  }
  const moved = !bare && MOVED[parsed.rest.replace(/\/$/, '')]
  if (moved) return redirect('/' + locale + moved)
  if (!bare && (parsed.rest === '' || parsed.rest === '/')) return redirect('/' + locale + '/home')
  const path = !bare && parsed.rest === '/home' ? '/' : parsed.rest
  const pre = '/' + locale

  const reqHeaders = new Headers(request.headers)
  reqHeaders.set('x-ms-locale', locale)
  reqHeaders.set('x-ms-path', path)

  const remember = (res: NextResponse) => {
    if (!bare && saved !== locale) res.cookies.set(COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
    return res
  }

  const go = (target?: string) => {
    const url = bare ? null : (target ?? path)
    return remember(url
      ? NextResponse.rewrite(new URL(url + search, request.url), { request: { headers: reqHeaders } })
      : NextResponse.next({ request: { headers: reqHeaders } }))
  }
  const to = (target: string, base?: string) => NextResponse.redirect(new URL(pre + homePath(target) + search, base ?? request.url))

  if (host.startsWith('careers.')) {
    if (path === '/') return go('/careers')
    if (path === '/opportunities') return go('/careers/opportunities')
    if (path === '/careers') return to('/')
    if (path === '/careers/opportunities') return to('/opportunities')
    return to(path, 'https://maisonsanguine.com')
  }

  if (host.startsWith('press.')) {
    if (path === '/log-in' || path === '/register') return go('/press' + path)
    if (path === '/' || path === '/press' || path.startsWith('/press/')) return to('/log-in')
    return to(path, 'https://maisonsanguine.com')
  }

  if (host.startsWith('msarchives.')) {
    if (path === '/') return go('/msarchives')
    if (path === '/explore' || path === '/about') return go('/msarchives' + path)
    if (path === '/msarchives' || path.startsWith('/msarchives/')) return to(path.replace(/^\/msarchives/, '') || '/')
    return to(path, 'https://maisonsanguine.com')
  }

  if (!PROTECTED.some(p => path === p || path.startsWith(p + '/')) && !path.startsWith('/auth')) return go()

  let response = go()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          reqHeaders.set('cookie', request.headers.get('cookie') || '')
          response = go()
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && PROTECTED.some(p => path === p || path.startsWith(p + '/'))) {
    const url = new URL(pre + '/auth/login', request.url)
    if (path !== '/dashboard') url.searchParams.set('next', pre + path + search)
    return NextResponse.redirect(url)
  }

  if (user && path.startsWith('/auth') && !path.startsWith('/auth/callback')) {
    return NextResponse.redirect(new URL(safeNext(request.nextUrl.searchParams.get('next'), pre + '/dashboard'), request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
