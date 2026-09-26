import { ImageResponse } from 'next/og'
import { posts } from '#site/content'
import { site } from '@/config/site'
import { formatDate } from '@/lib/format'
import { ogFonts, OG_SIZE } from '@/lib/og'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = site.title

export function generateStaticParams(): { slug: string }[] {
  return posts.filter((post) => !post.draft).map((post) => ({ slug: post.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug && !p.draft)
  const title = post?.title ?? site.title
  const category = post?.category ?? ''
  const date = post ? formatDate(post.date) : ''

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#fbfbfa',
          padding: '72px 80px',
          fontFamily: 'Pretendard',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: '0.18em',
            color: '#9a9a94',
            textTransform: 'uppercase',
          }}
        >
          {category}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.22,
            color: '#1a1a1a',
            maxWidth: '960px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid #1a1a1a',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 700, color: '#1a1a1a' }}>
            {site.title}
          </div>
          <div style={{ display: 'flex', fontSize: 24, color: '#9a9a94' }}>{date}</div>
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts() },
  )
}
