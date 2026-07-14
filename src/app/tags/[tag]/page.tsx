import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { posts } from '#site/content'
import { PostList } from '@/components/post-list'
import { getAllTags, getByTag } from '@/lib/posts'

interface Props {
  params: Promise<{ tag: string }>
}

export function generateStaticParams() {
  return getAllTags(posts).map(({ tag }) => ({ tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  return { title: `#${decodeURIComponent(tag)}` }
}

export default async function TagPage({ params }: Props) {
  const tag = decodeURIComponent((await params).tag)
  const tagged = getByTag(posts, tag)
  if (tagged.length === 0) notFound()

  return (
    <section>
      <h1 className="mb-8 text-xl font-bold">#{tag}</h1>
      <PostList posts={tagged} />
    </section>
  )
}
