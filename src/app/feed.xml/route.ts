import { posts } from '#site/content'
import { site } from '@/config/site'
import { getPublished } from '@/lib/posts'

export const dynamic = 'force-static'

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function GET() {
  const items = getPublished(posts)
    .map((post) =>
      [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${site.url}${post.permalink}</link>`,
        `      <guid>${site.url}${post.permalink}</guid>`,
        `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        post.description ? `      <description>${escapeXml(post.description)}</description>` : null,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
