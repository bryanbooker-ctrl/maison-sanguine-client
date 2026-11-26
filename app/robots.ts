import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = ((await headers()).get('host') || 'maisonsanguine.com').toLowerCase()
  const origin = (/^(localhost|127\.)/.test(host) ? 'http://' : 'https://') + host
  if (host.startsWith('press.')) return { rules: { userAgent: '*', disallow: '/' } }
  const priv = ['dashboard', 'request', 'admin', 'auth', 'applications', 'careers/applications']
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', ...priv.flatMap(p => ['/*/' + p, '/*/*/' + p])],
    },
    sitemap: origin + '/sitemap.xml',
  }
}
