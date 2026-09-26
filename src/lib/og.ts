import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// satori(ImageResponse)는 한글을 그리려면 TTF/OTF를 직접 넣어야 한다.
// Pretendard의 TrueType(alternative)을 빌드 시점에 읽어 사용한다.
const fontDir = join(
  process.cwd(),
  'node_modules/pretendard/dist/public/static/alternative',
)

export function ogFonts() {
  return [
    {
      name: 'Pretendard',
      data: readFileSync(join(fontDir, 'Pretendard-Regular.ttf')),
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Pretendard',
      data: readFileSync(join(fontDir, 'Pretendard-Bold.ttf')),
      weight: 700 as const,
      style: 'normal' as const,
    },
  ]
}

export const OG_SIZE = { width: 1200, height: 630 }
