import type { Metadata } from 'next'
import { posts } from '#site/content'
import { PostList } from '@/components/post-list'
import { getByCategory } from '@/lib/posts'

export const metadata: Metadata = { title: 'Life' }

export default function LifePage() {
  return (
    <section>
      <h1 className="mb-8 text-xl font-bold">Life</h1>
      <PostList posts={getByCategory(posts, 'life')} />
    </section>
  )
}
