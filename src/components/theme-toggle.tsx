'use client'

import { useTheme } from 'next-themes'
import { useLayoutEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return <span className="inline-block h-8 w-8" />

  return (
    <button
      type="button"
      aria-label="테마 전환"
      className="h-8 w-8 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
