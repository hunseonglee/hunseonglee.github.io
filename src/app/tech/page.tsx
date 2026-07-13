import type { Metadata } from 'next'
import { posts } from '#site/content'
import { PostList } from '@/components/post-list'
import { getByCategory } from '@/lib/posts'

export const metadata: Metadata = { title: 'Tech' }

export default function TechPage() {
  return (
    <section>
      <h1 className="mb-8 text-xl font-bold">Tech</h1>
      <PostList posts={getByCategory(posts, 'tech')} />
    </section>
  )
}
