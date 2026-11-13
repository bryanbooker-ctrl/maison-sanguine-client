import type { Metadata, Viewport } from 'next'
import SiteChrome from './site/SiteChrome'
import { MS_DATA, MS_SCRIPTS } from './site/chrome'
import { getLocale, getPublicPath, accountDict, trHtml, trJs, localizeMetadata, t, tc } from '@/lib/i18n'
import AccountI18n from './site/AccountI18n'
import { TRANSLATED } from '@/lib/locales'
import { INTL, INTL_COUNTRIES, LANG_NAMES, LOCATIONS, htmlLang, intlCountry, langOf, locOf } from '@/lib/locations'
import { cookies } from 'next/headers'
import './globals.css'

const META: Metadata = {
  title: 'Maison Sanguine | MS Account',
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
  const lang = langOf(locale)
  const ui = TRANSLATED.includes(lang) ? lang : 'en'
  const account = ui !== 'en' && /^\/(dashboard|auth|request)(\/|$)/.test(path)
  const saved = (await cookies()).get('ms_region')?.value
  const loc = {
    ctx: locale, loc: locOf(locale), lang, ui: htmlLang(ui),
    region: locOf(locale) === INTL && intlCountry(saved) ? saved : '',
    locations: LOCATIONS, names: LANG_NAMES,
    intl: INTL_COUNTRIES.map(c => ({ region: c.region, currency: c.currency, label: c.label && t(c.label, locale) })),
    t: {
      change: t('Change', locale), location2: tc('Change', 'Location /', locale), language2: tc('Location /', 'Language', locale),
      location: tc('Location / Language', 'Location', locale), language: t('Language', locale), apply: t('Apply', locale), close: t('Close', locale),
      international: t('International', locale),
      help: t('Select a country or region to set your language and the currency of your reservations.', locale),
    },
  }
  return (
    <html lang={htmlLang(ui)} data-ms-loc={locale} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: 'html:not(.ms-cover-off){background:#000}html:not(.ms-cover-off) body{visibility:hidden}' }} />
        <script dangerouslySetInnerHTML={{ __html: "setTimeout(function(){document.documentElement.classList.add('ms-cover-off')},4000)" }} />
        <link rel="preconnect" href="https://images.squarespace-cdn.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,300&display=swap" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer@200,400&display=swap" />
      </head>
      <body suppressHydrationWarning>
        <script type="application/json" id="ms-loc-data" dangerouslySetInnerHTML={{ __html: JSON.stringify(loc).replace(/</g, '\\u003c') }} />
        <SiteChrome data={trHtml(MS_DATA, locale)} scripts={MS_SCRIPTS.map(code => trJs(code, locale))} menu={Object.fromEntries(['Welcome', 'Upcoming Night', 'My MS', 'Your Next Night', 'Log out'].map(k => [k, t(k, locale)]))} />
        {children}
        {account && <AccountI18n dict={accountDict(locale)} />}
        <div id="ms-foot-host" />
      </body>
    </html>
  )
}
