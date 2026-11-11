import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { safeNext } from '@/lib/next'

const PROTECTED = ['/dashboard', '/request', '/admin']

const PASS = ['/_next', '/api', '/favicon.ico']

export async function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase()
  const { pathname: path } = request.nextUrl

  if (host.startsWith('careers.')) {
    if (PASS.some(p => path === p || path.startsWith(p + '/'))) return NextResponse.next()
    if (path === '/') return NextResponse.rewrite(new URL('/careers' + request.nextUrl.search, request.url))
    if (path === '/opportunities') return NextResponse.rewrite(new URL('/careers/opportunities' + request.nextUrl.search, request.url))
    if (path === '/careers' || path.startsWith('/fr')) return NextResponse.redirect(new URL('/' + request.nextUrl.search, request.url))
    if (path === '/careers/opportunities') return NextResponse.redirect(new URL('/opportunities' + request.nextUrl.search, request.url))
    return NextResponse.redirect(new URL(path + request.nextUrl.search, 'https://maisonsanguine.com'))
  }

  if (host.startsWith('press.')) {
    if (PASS.some(p => path === p || path.startsWith(p + '/'))) return NextResponse.next()
    if (path === '/log-in' || path === '/register') return NextResponse.rewrite(new URL('/press' + path + request.nextUrl.search, request.url))
    if (path === '/' || path === '/press' || path.startsWith('/press/') || path.startsWith('/fr')) return NextResponse.redirect(new URL('/log-in' + request.nextUrl.search, request.url))
    return NextResponse.redirect(new URL(path + request.nextUrl.search, 'https://maisonsanguine.com'))
  }

  if (host.startsWith('msarchives.')) {
    if (PASS.some(p => path === p || path.startsWith(p + '/'))) return NextResponse.next()
    if (path === '/') return NextResponse.rewrite(new URL('/msarchives' + request.nextUrl.search, request.url))
    if (path === '/explore' || path === '/about') return NextResponse.rewrite(new URL('/msarchives' + path + request.nextUrl.search, request.url))
    if (path === '/msarchives' || path.startsWith('/msarchives/') || path.startsWith('/fr')) return NextResponse.redirect(new URL((path.startsWith('/fr') ? '/' : path.replace(/^\/msarchives/, '') || '/') + request.nextUrl.search, request.url))
    return NextResponse.redirect(new URL(path + request.nextUrl.search, 'https://maisonsanguine.com'))
  }

  if (!PROTECTED.some(p => path === p || path.startsWith(p + '/')) && !path.startsWith('/auth')) return NextResponse.next()

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname, search } = request.nextUrl

  if (!user && PROTECTED.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    const url = new URL('/auth/login', request.url)
    if (pathname !== '/dashboard') url.searchParams.set('next', pathname + search)
    return NextResponse.redirect(url)
  }

  if (user && pathname.startsWith('/auth') && !pathname.startsWith('/auth/callback')) {
    return NextResponse.redirect(new URL(safeNext(request.nextUrl.searchParams.get('next')), request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
