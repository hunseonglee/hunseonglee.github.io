import { defineCollection, defineConfig, s } from 'velite'
import rehypePrettyCode from 'rehype-pretty-code'

// ```mermaid 코드블록을 <pre class="mermaid">원본</pre>로 바꿔 shiki를 우회시킨다.
// 클라이언트 Mermaid 컴포넌트가 이 노드를 찾아 다이어그램으로 렌더한다.
function rehypeMermaid() {
  const textOf = (node: any): string =>
    node.type === 'text'
      ? node.value
      : (node.children ?? []).map(textOf).join('')

  const visit = (node: any) => {
    for (const child of node.children ?? []) {
      const code = child.tagName === 'pre' ? child.children?.[0] : null
      const cls = code?.properties?.className ?? []
      if (code?.tagName === 'code' && cls.includes('language-mermaid')) {
        child.properties = { className: ['mermaid'] }
        child.children = [{ type: 'text', value: textOf(code) }]
      } else {
        visit(child)
      }
    }
  }
  return (tree: any) => visit(tree)
}

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
  markdown: {
    rehypePlugins: [
      rehypeMermaid,
      [
        rehypePrettyCode,
        {
          theme: { light: 'github-light', dark: 'github-dark' },
          defaultColor: false,
          // 언어 없는 코드블록도 plaintext로 처리 → shiki 배경/색 변수를 갖게 해 일관 스타일 적용
          defaultLang: 'plaintext',
        },
      ],
    ],
  },
})
