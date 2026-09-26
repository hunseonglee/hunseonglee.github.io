import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { site } from '@/config/site'

export const metadata: Metadata = {
  title: { default: site.title, template: `%s | ${site.title}` },
  description: site.description,
  metadataBase: new URL(site.url),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: `${site.title} RSS` }],
    },
  },
  openGraph: {
    type: 'website',
    siteName: site.title,
    locale: 'ko_KR',
    url: site.url,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="mx-auto min-h-screen max-w-2xl px-4 antialiased">
        <ThemeProvider>
          <Header />
          <main className="py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
