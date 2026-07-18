import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { posts } from '#site/content'
import { formatDate } from '@/lib/format'
import { Comments } from '@/components/comments'

interface Props {
  params: Promise<{ slug: string }>
}

function findPost(slug: string) {
  return posts.find((post) => post.slug === slug && !post.draft)
}

export function generateStaticParams() {
  return posts.filter((post) => !post.draft).map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) return {}
  return { title: post.title, description: post.description }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) notFound()

  return (
    <article>
      <header className="mb-10">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="mt-2 text-sm text-neutral-500">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        {post.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link href={`/tags/${tag}`} className="text-neutral-500 hover:underline">
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>
      <div
        className="prose prose-neutral max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <Comments />
    </article>
  )
}
