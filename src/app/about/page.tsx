import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <section>
      <h1 className="mb-8 text-xl font-bold">About</h1>
      <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
        안녕하세요. 기술과 일상을 기록하는 블로그입니다.
        {/* TODO(사용자): 자기소개로 교체 */}
      </p>
    </section>
  )
}
