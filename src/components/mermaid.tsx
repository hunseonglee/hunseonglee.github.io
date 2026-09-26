'use client'

import { useTheme } from 'next-themes'
import { useEffect } from 'react'

// 본문의 <pre class="mermaid"> 노드를 다이어그램으로 렌더한다.
// 테마(라이트/다크)가 바뀌면 원본 소스로 되돌린 뒤 다시 그린다.
export function Mermaid() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('pre.mermaid'),
    )
    if (nodes.length === 0) return

    let cancelled = false
    void (async () => {
      const mermaid = (await import('mermaid')).default
      for (const el of nodes) {
        if (el.dataset.src === undefined) el.dataset.src = el.textContent ?? ''
        el.removeAttribute('data-processed')
        el.innerHTML = el.dataset.src ?? ''
      }
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === 'dark' ? 'dark' : 'neutral',
        // 본인 블로그의 신뢰된 콘텐츠 — 라벨의 <br/> 줄바꿈을 위해 loose 허용
        securityLevel: 'loose',
        fontFamily:
          "'Pretendard Variable', -apple-system, 'Apple SD Gothic Neo', sans-serif",
      })
      if (cancelled) return
      await mermaid.run({ nodes })
    })()

    return () => {
      cancelled = true
    }
  }, [resolvedTheme])

  return null
}
