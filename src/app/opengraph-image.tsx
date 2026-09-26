import { ImageResponse } from 'next/og'
import { site } from '@/config/site'
import { ogFonts, OG_SIZE } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = site.title

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#fbfbfa',
          padding: '80px',
          fontFamily: 'Pretendard',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontWeight: 700,
            color: '#1a1a1a',
            letterSpacing: '-0.02em',
          }}
        >
          {site.title}
        </div>
        <div
          style={{ display: 'flex', width: 64, height: 3, background: '#1a1a1a', margin: '32px 0' }}
        />
        <div style={{ display: 'flex', fontSize: 34, color: '#6b6b64' }}>
          {site.description}
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts() },
  )
}
