import type { MetadataRoute } from 'next'
import { posts } from '#site/content'
import { site } from '@/config/site'
import { getAllTags, getPublished } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/tech', '/life', '/tags', '/search', '/about'].map((path) => ({
    url: `${site.url}${path}`,
  }))
  const postPages = getPublished(posts).map((post) => ({
    url: `${site.url}${post.permalink}`,
    lastModified: post.date,
  }))
  const tagPages = getAllTags(posts).map(({ tag }) => ({
    url: `${site.url}/tags/${encodeURIComponent(tag)}`,
  }))
  return [...staticPages, ...postPages, ...tagPages]
}
