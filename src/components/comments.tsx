'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

const repo = process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}` | undefined
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

export function Comments() {
  const { resolvedTheme } = useTheme()

  if (!repo || !repoId || !category || !categoryId) return null

  return (
    <section className="mt-16">
      <Giscus
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="ko"
      />
    </section>
  )
}
