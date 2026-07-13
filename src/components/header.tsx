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
    <header className="flex items-center justify-between py-6">
      <Link href="/" className="font-bold">
        {site.title}
      </Link>
      <div className="flex items-center gap-1">
        <nav className="flex gap-1 text-sm">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-2 py-1.5 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              {label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
