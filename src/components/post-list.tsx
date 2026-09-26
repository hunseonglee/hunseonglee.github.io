import Link from 'next/link'
import type { Post } from '#site/content'
import { formatMonthDay } from '@/lib/format'
import { groupByYear } from '@/lib/posts'

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="text-meta">아직 글이 없습니다.</p>
  }

  return (
    <div>
      {groupByYear(posts).map(({ year, posts }) => (
        <section key={year} className="mt-8 first:mt-0">
          <h2 className="mb-3 text-xs uppercase tracking-[0.16em] text-meta">{year}</h2>
          <ul>
            {posts.map((post) => (
              <li
                key={post.slug}
                className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 py-1.5"
              >
                <time dateTime={post.date} className="text-xs tabular-nums text-meta">
                  {formatMonthDay(post.date)}
                </time>
                <span>
                  <Link
                    href={post.permalink}
                    className="font-reading hover:underline hover:underline-offset-[3px]"
                  >
                    {post.title}
                  </Link>
                  <span className="ml-2 text-[0.62rem] uppercase tracking-[0.1em] text-cat">
                    {post.category}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
