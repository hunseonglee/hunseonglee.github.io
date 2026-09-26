import Link from 'next/link'
import { site } from '@/config/site'
import { ThemeToggle } from './theme-toggle'

const nav = [
  { href: '/tech', label: 'Tech' },
  { href: '/life', label: 'Life' },
  { href: '/tags', label: 'Tags' },
  { href: '/search', label: 'Search' },
  { href: '/about', label: 'About' },
]

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-line py-6">
      <Link href="/" className="font-semibold">
        {site.title}
      </Link>
      <div className="flex items-center gap-3">
        <nav className="flex gap-3 text-sm text-meta">
          {nav.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
