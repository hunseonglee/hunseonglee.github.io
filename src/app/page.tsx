import { posts } from '#site/content'
import { PostList } from '@/components/post-list'
import { getPublished } from '@/lib/posts'

export default function HomePage() {
  return <PostList posts={getPublished(posts)} />
}
