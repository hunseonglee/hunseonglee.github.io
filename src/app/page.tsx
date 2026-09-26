import { posts } from '#site/content'
import { PostList } from '@/components/post-list'
import { site } from '@/config/site'
import { getPublished } from '@/lib/posts'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.title,
  url: site.url,
  description: site.description,
  inLanguage: 'ko-KR',
  author: { '@type': 'Person', name: site.author, url: site.url },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostList posts={getPublished(posts)} />
    </>
  )
}
