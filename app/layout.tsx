import type { Metadata, Viewport } from 'next'
import SiteChrome from './site/SiteChrome'
import './globals.css'

export const metadata: Metadata = {
  title: 'MS Account | Maison Sanguine',
  description: 'Your personal MS Account: invitations, experiences and exclusive services of Maison Sanguine.',
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  viewportFit: 'cover',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.squarespace-cdn.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,300&display=swap" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer@200,400&display=swap" />
      </head>
      <body suppressHydrationWarning>
        <SiteChrome />
        {children}
        <div id="ms-foot-host" />
      </body>
    </html>
  )
}
