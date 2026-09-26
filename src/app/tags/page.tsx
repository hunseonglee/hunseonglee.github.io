import type { Metadata } from 'next'
import Link from 'next/link'
import { posts } from '#site/content'
import { getAllTags } from '@/lib/posts'

export const metadata: Metadata = { title: 'Tags' }

export default function TagsPage() {
  const tags = getAllTags(posts)
  return (
    <section>
      <h1 className="mb-8 text-xl font-bold">Tags</h1>
      {tags.length === 0 ? (
        <p className="text-meta">아직 태그가 없습니다.</p>
      ) : (
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {tags.map(({ tag, count }) => (
            <li key={tag}>
              <Link href={`/tags/${encodeURIComponent(tag)}`} className="hover:underline">
                #{tag} <span className="text-sm text-meta">({count})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
