'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // next-themes hydration guard: SSR에서는 resolvedTheme를 알 수 없어 mounted 플래그가 필요
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return <span className="inline-block h-6 w-6" />

  return (
    <button
      type="button"
      aria-label="테마 전환"
      className="h-6 w-6 text-meta hover:text-ink"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? '☾' : '☀'}
    </button>
  )
}
