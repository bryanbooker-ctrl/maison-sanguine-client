import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { TRANSLATED } from '@/lib/locales'
import { LOCATIONS, hreflangOf, prefixOf } from '@/lib/locations'

const JOBS = ['brand-communications-manager', 'head-of-guest-experience', 'head-of-production', 'production-coordinator']

const MAIN = [
  '/home', '/night-collection', '/night/2027-season', '/night/absolute-mastery', '/night/exceptional-productions', '/night/winter-edition-aspen-season-27',
  '/night-collection/winter-edition/saturday-february-20-2027', '/night-collection/spring-edition/monday-may-3-2027',
  '/night-collection/rite-of-summer/saturday-july-24-2027', '/night-collection/fall-edition/saturday-october-2-2027',
  '/night-collection/msnye/friday-december-31-2027', '/news', '/locations', '/masterclasses',
  '/about/origins', '/about/music', '/about/commitments', '/about/house-of-jubilation',
  '/about/experiences/acoustics', '/about/experiences/atmospheres', '/about/experiences/design', '/about/experiences/pioneering-spirit',
  '/form/contact-us', '/form/newsletter-subscription',
  '/legal/accessibility', '/legal/cookie-policy', '/legal/events-terms-and-conditions', '/legal/general-terms-of-sale',
  '/legal/masterclasses-terms-of-sale', '/legal/privacy-notice', '/legal/terms-of-use',
]

const SUB: Record<string, string[]> = {
  careers: ['/home', '/opportunities', '/life-at-ms', ...JOBS.map(j => '/opportunities/' + j)],
  msarchives: ['/home', '/explore', '/about'],
  studio: ['/home', '/guided-tour', '/about/born-in-paris', '/about/at-the-heart-of-mastery', '/about/designing-night', '/about/the-studio', '/masterclasses/the-making-of-a-night'],
  initiative: ['/home', '/about'],
  press: [],
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = ((await headers()).get('host') || 'maisonsanguine.com').toLowerCase()
  const origin = (/^(localhost|127\.)/.test(host) ? 'http://' : 'https://') + host
  const sub = host.match(/^(careers|press|msarchives|studio|initiative)\./)
  const paths = sub ? SUB[sub[1]] : MAIN
  return paths.map(path => {
    const languages: Record<string, string> = {}
    for (const l of LOCATIONS) for (const lang of l.langs) if (TRANSLATED.includes(lang)) languages[hreflangOf(l.code, lang)] = origin + '/' + prefixOf(l.code, lang) + path
    return { url: origin + '/en' + path, alternates: { languages: { ...languages, 'x-default': origin + '/en' + path } } }
  })
}
