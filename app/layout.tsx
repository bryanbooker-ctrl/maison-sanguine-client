import type { Metadata, Viewport } from 'next'
import SiteChrome from './site/SiteChrome'
import { MS_DATA, MS_SCRIPTS } from './site/chrome'
import { getLocale, getPublicPath, accountDict, trHtml, trJs, localizeMetadata } from '@/lib/i18n'
import AccountI18n from './site/AccountI18n'
import { LOCALES } from '@/lib/locales'
import './globals.css'

const META: Metadata = {
  title: 'MS Account | Maison Sanguine',
  description: 'Your personal MS Account: invitations, experiences and exclusive services of Maison Sanguine.',
}

export const generateMetadata = () => localizeMetadata(META)

export const viewport: Viewport = {
  themeColor: '#ffffff',
  viewportFit: 'cover',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale()
  const path = await getPublicPath()
  const account = locale !== 'en' && /^\/(dashboard|auth|request)(\/|$)/.test(path)
  return (
    <html lang={locale} data-langs={LOCALES.join(',')} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.squarespace-cdn.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,300&display=swap" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer@200,400&display=swap" />
      </head>
      <body suppressHydrationWarning>
        <SiteChrome data={trHtml(MS_DATA, locale)} scripts={MS_SCRIPTS.map(code => trJs(code, locale))} />
        {children}
        {account && <AccountI18n dict={accountDict(locale)} />}
        <div id="ms-foot-host" />
      </body>
    </html>
  )
}
