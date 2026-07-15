import type { Metadata } from 'next'
import { posts } from '#site/content'
import { Search } from '@/components/search'
import { getPublished } from '@/lib/posts'

export const metadata: Metadata = { title: 'Search' }

export default function SearchPage() {
  const items = getPublished(posts).map((post) => ({
    title: post.title,
    description: post.description ?? '',
    tags: post.tags,
    permalink: post.permalink,
  }))

  return (
    <section>
      <h1 className="mb-8 text-xl font-bold">Search</h1>
      <Search items={items} />
    </section>
  )
}
