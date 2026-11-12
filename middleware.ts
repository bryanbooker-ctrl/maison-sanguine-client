import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { safeNext } from '@/lib/next'
import { PREFIXED } from '@/lib/locales'

const PROTECTED = ['/dashboard', '/request', '/admin']

const PASS = ['/_next', '/api', '/favicon.ico']


function splitLocale(path: string) {
  const m = path.match(/^\/([a-z]{2})(?=\/|$)/)
  if (m && PREFIXED.includes(m[1])) return { locale: m[1], path: path.slice(3) || '/' }
  return { locale: 'en', path }
}

export async function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase()
  const search = request.nextUrl.search
  const raw = request.nextUrl.pathname

  if (PASS.some(p => raw === p || raw.startsWith(p + '/'))) return NextResponse.next()

  if (!/^(careers|press|msarchives)\./.test(host)) {
    if (raw === '/fr/home') return NextResponse.redirect(new URL('/fr/careers' + search, request.url))
    if (raw === '/fr/opportunities') return NextResponse.redirect(new URL('/fr/careers/opportunities' + search, request.url))
  }

  const { locale, path } = splitLocale(raw)
  const pre = locale === 'en' ? '' : '/' + locale

  const reqHeaders = new Headers(request.headers)
  reqHeaders.set('x-ms-locale', locale)
  reqHeaders.set('x-ms-path', path)

  const isAccount = /^\/(dashboard|auth|request)(\/|$)/.test(path)
  const pref = request.cookies.get('ms_lang')?.value
  if (locale === 'en' && pref && pref !== 'en' && PREFIXED.includes(pref) && isAccount) {
    return NextResponse.redirect(new URL('/' + pref + path + search, request.url))
  }
  const remember = (res: NextResponse) => {
    if ((locale !== 'en' && pref !== locale) || (locale === 'en' && pref && pref !== 'en' && !isAccount)) {
      res.cookies.set('ms_lang', locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
    }
    return res
  }

  const go = (target?: string) => {
    const url = target ?? (pre ? path : null)
    return remember(url
      ? NextResponse.rewrite(new URL(url + search, request.url), { request: { headers: reqHeaders } })
      : NextResponse.next({ request: { headers: reqHeaders } }))
  }
  const to = (target: string, base?: string) => NextResponse.redirect(new URL(pre + target + search, base ?? request.url))

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
