import Link from 'next/link'
import type { Post } from '#site/content'
import { formatDate } from '@/lib/format'

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="text-neutral-500">아직 글이 없습니다.</p>
  }
  return (
    <ul className="space-y-10">
      {posts.map((post) => (
        <li key={post.slug}>
          <article>
            <Link href={post.permalink}>
              <h2 className="text-lg font-semibold hover:underline">{post.title}</h2>
            </Link>
            <p className="mt-1 text-sm text-neutral-500">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {' · '}
              {post.category}
            </p>
            {post.description && (
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">{post.description}</p>
            )}
          </article>
        </li>
      ))}
    </ul>
  )
}
