import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { posts } from '#site/content'
import { formatDate } from '@/lib/format'
import { site } from '@/config/site'
import { Comments } from '@/components/comments'
import { Mermaid } from '@/components/mermaid'

interface Props {
  params: Promise<{ slug: string }>
}

function findPost(slug: string) {
  return posts.find((post) => post.slug === slug && !post.draft)
}

export function generateStaticParams(): { slug: string }[] {
  return posts.filter((post) => !post.draft).map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) return {}
  const description = post.description ?? site.description
  return {
    title: post.title,
    description,
    alternates: { canonical: post.permalink },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: post.permalink,
      publishedTime: new Date(post.date).toISOString(),
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) notFound()

  const url = `${site.url}${post.permalink}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description ?? site.description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: { '@type': 'Person', name: site.author, url: site.url },
    publisher: { '@type': 'Person', name: site.author, url: site.url },
    mainEntityOfPage: url,
    url,
    image: `${url}/opengraph-image`,
    inLanguage: 'ko-KR',
    ...(post.tags.length > 0 ? { keywords: post.tags.join(', ') } : {}),
  }

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-10">
        <h1 className="font-reading text-2xl font-bold">{post.title}</h1>
        <p className="mt-2 text-sm text-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        {post.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link href={`/tags/${encodeURIComponent(tag)}`} className="text-meta hover:text-ink">
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
      <Mermaid />
      <Comments />
    </article>
  )
}
