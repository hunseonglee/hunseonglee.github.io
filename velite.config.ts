import { defineCollection, defineConfig, s } from 'velite'

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.md',
  schema: s
    .object({
      title: s.string(),
      date: s.isodate(),
      category: s.enum(['tech', 'life']),
      tags: s.array(s.string()).default([]),
      description: s.string().optional(),
      draft: s.boolean().default(false),
      path: s.path(),
      content: s.markdown(),
    })
    .transform((data) => {
      const slug = data.path
        .replace(/^posts\//, '')
        .replace(/^\d{4}-\d{2}-\d{2}-/, '')
      return { ...data, slug, permalink: `/posts/${slug}` }
    }),
})

export default defineConfig({
  root: 'content',
  collections: { posts },
})
