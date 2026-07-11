# Next.js + Velite 개인 블로그 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 마크다운 파일로 글을 쓰고 git push하면 배포되는, 다크모드·태그·검색·댓글을 갖춘 정적 개인 블로그.

**Architecture:** Velite가 `content/posts/*.md`를 빌드 시 파싱·검증해 타입 있는 JSON(`.velite/`)으로 변환하고, Next.js App Router 페이지들이 이를 import해 전부 정적 생성(SSG)한다. 서버 로직·DB 없음.

**Tech Stack:** Next.js (App Router, TypeScript), Velite, Tailwind CSS v4, next-themes, rehype-pretty-code, giscus, Vitest, Vercel

**Spec:** `docs/superpowers/specs/2026-07-12-nextjs-blog-design.md`

## Global Constraints

- Node 20+, 패키지 매니저는 npm
- TypeScript strict 모드 (create-next-app 기본값 유지)
- 카테고리는 `"tech" | "life"` 두 개로 고정
- 모든 페이지는 정적 생성(SSG). 서버 로직·DB 금지
- `draft: true` 글은 목록·태그·검색·RSS·sitemap 전부에서 제외
- 경로 별칭: `@/*` → `./src/*`, `#site/content` → `./.velite`
- 본문 컨테이너 폭 `max-w-2xl`, 폰트 Pretendard, 색은 neutral 계열 + 최소한의 포인트
- 커밋 메시지는 conventional commits (`feat:`, `chore:`, `test:` 등)

---

### Task 1: Next.js 프로젝트 스캐폴딩

**Files:**
- Create: Next.js 표준 구조 전체 (`package.json`, `src/app/*`, `next.config.ts`, `tsconfig.json` 등)
- Modify: `.gitignore` (기존 `.claude/settings.local.json` 항목 유지)

**Interfaces:**
- Consumes: 없음
- Produces: `npm run dev` / `npm run build`가 동작하는 Next.js 앱. 경로 별칭 `@/*` → `./src/*`

- [ ] **Step 1: 임시 디렉토리에 스캐폴딩**

현재 디렉토리에 `docs/`, `.claude/`가 있어 create-next-app이 거부하므로 임시 폴더에 생성 후 옮긴다.

```bash
npx create-next-app@latest .scaffold --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --skip-install
```

남은 프롬프트가 있으면 전부 기본값(Enter) 선택.

- [ ] **Step 2: 루트로 이동하고 .gitignore 병합**

```bash
rsync -a .scaffold/ ./
rm -rf .scaffold
printf '\n# claude local settings\n.claude/settings.local.json\n' >> .gitignore
npm install
```

- [ ] **Step 3: 빌드 검증**

Run: `npm run build`
Expected: 에러 없이 빌드 성공, `Route (app)` 테이블에 `/` 출력

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "chore: Next.js 프로젝트 스캐폴딩"
```

---

### Task 2: Velite 콘텐츠 파이프라인

**Files:**
- Create: `velite.config.ts`, `content/posts/2026-07-12-hello-world.md`, `content/posts/2026-07-10-summer-days.md`, `content/posts/2026-07-11-draft-example.md`
- Modify: `next.config.ts`, `tsconfig.json`, `.gitignore`

**Interfaces:**
- Consumes: Task 1의 Next.js 프로젝트
- Produces: `import { posts, type Post } from '#site/content'` — `Post`는 `{ title: string; date: string; category: 'tech' | 'life'; tags: string[]; description?: string; draft: boolean; path: string; content: string(html); slug: string; permalink: string }`

- [ ] **Step 1: velite 설치**

```bash
npm install -D velite
```

- [ ] **Step 2: velite.config.ts 작성**

```ts
// velite.config.ts
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
```

- [ ] **Step 3: next.config.ts에 Velite 통합**

기존 `next.config.ts`를 다음으로 교체 (dev/build 시작 시 Velite가 자동 실행되어 `.velite/`를 생성·감시):

```ts
// next.config.ts
import type { NextConfig } from 'next'

const isDev = process.argv.indexOf('dev') !== -1
const isBuild = process.argv.indexOf('build') !== -1
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  const { build } = await import('velite')
  await build({ watch: isDev, clean: !isDev })
}

const nextConfig: NextConfig = {}

export default nextConfig
```

- [ ] **Step 4: tsconfig 경로 별칭과 .gitignore 추가**

`tsconfig.json`의 `compilerOptions.paths`에 추가:

```json
"paths": {
  "@/*": ["./src/*"],
  "#site/content": ["./.velite"]
}
```

`.gitignore`에 추가:

```bash
printf '\n# velite\n.velite\n' >> .gitignore
```

- [ ] **Step 5: 샘플 글 3개 작성 (tech / life / draft)**

```markdown
<!-- content/posts/2026-07-12-hello-world.md -->
---
title: 블로그를 시작합니다
date: 2026-07-12
category: tech
tags: [nextjs, blog]
description: Next.js와 Velite로 만든 블로그의 첫 글
---

첫 글입니다. 코드 하이라이팅 테스트:

```ts
export function greet(name: string): string {
  return `안녕하세요, ${name}님`
}
```

마크다운이 잘 렌더링되는지 확인합니다.
```

```markdown
<!-- content/posts/2026-07-10-summer-days.md -->
---
title: 여름 기록
date: 2026-07-10
category: life
tags: [일상]
description: 요즘의 일상
---

일상 글 샘플입니다.
```

```markdown
<!-- content/posts/2026-07-11-draft-example.md -->
---
title: 아직 작성 중인 글
date: 2026-07-11
category: tech
draft: true
---

이 글은 draft라서 어디에도 노출되면 안 됩니다.
```

- [ ] **Step 6: Velite 단독 실행으로 검증**

Run: `npx velite`
Expected: `.velite/posts.json` 생성. 파일을 열어 3개 글이 있고, hello-world 항목의 `slug`가 `hello-world`(날짜 제거됨), `permalink`가 `/posts/hello-world`인지 확인

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "feat: Velite 콘텐츠 파이프라인 및 샘플 글 추가"
```

---

### Task 3: 글 유틸 함수 (TDD)

**Files:**
- Create: `src/lib/posts.ts`, `src/lib/posts.test.ts`, `src/lib/format.ts`, `src/lib/format.test.ts`, `vitest.config.ts`
- Modify: `package.json` (test 스크립트)

**Interfaces:**
- Consumes: 없음 (velite 타입에 의존하지 않는 순수 함수 — `PostLike` 구조적 타입 사용)
- Produces:
  - `getPublished<T extends PostLike>(posts: T[]): T[]` — draft 제외 + 최신순 정렬
  - `getByCategory<T extends PostLike>(posts: T[], category: 'tech' | 'life'): T[]`
  - `getByTag<T extends PostLike>(posts: T[], tag: string): T[]`
  - `getAllTags(posts: PostLike[]): { tag: string; count: number }[]` — published만 집계, count 내림차순 → 이름순
  - `formatDate(iso: string): string` — `'2026년 7월 12일'` 형식

- [ ] **Step 1: Vitest 설치·설정**

```bash
npm install -D vitest
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
})
```

`package.json`의 `scripts`에 추가: `"test": "vitest run"`

- [ ] **Step 2: 실패하는 테스트 작성**

```ts
// src/lib/posts.test.ts
import { describe, expect, it } from 'vitest'
import { getAllTags, getByCategory, getByTag, getPublished, type PostLike } from './posts'

const make = (over: Partial<PostLike>): PostLike => ({
  slug: 'post',
  date: '2026-07-01',
  draft: false,
  category: 'tech',
  tags: [],
  ...over,
})

describe('getPublished', () => {
  it('draft 글을 제외하고 최신순으로 정렬한다', () => {
    const posts = [
      make({ slug: 'old', date: '2026-07-01' }),
      make({ slug: 'hidden', date: '2026-07-03', draft: true }),
      make({ slug: 'new', date: '2026-07-02' }),
    ]
    expect(getPublished(posts).map((p) => p.slug)).toEqual(['new', 'old'])
  })

  it('원본 배열을 변경하지 않는다', () => {
    const posts = [make({ slug: 'a', date: '2026-07-01' }), make({ slug: 'b', date: '2026-07-02' })]
    getPublished(posts)
    expect(posts[0].slug).toBe('a')
  })
})

describe('getByCategory', () => {
  it('해당 카테고리의 published 글만 반환한다', () => {
    const posts = [
      make({ slug: 'tech-1', category: 'tech' }),
      make({ slug: 'life-1', category: 'life' }),
      make({ slug: 'tech-draft', category: 'tech', draft: true }),
    ]
    expect(getByCategory(posts, 'tech').map((p) => p.slug)).toEqual(['tech-1'])
  })
})

describe('getByTag', () => {
  it('해당 태그가 달린 published 글만 반환한다', () => {
    const posts = [
      make({ slug: 'a', tags: ['nextjs', 'blog'] }),
      make({ slug: 'b', tags: ['blog'] }),
      make({ slug: 'c', tags: ['nextjs'], draft: true }),
    ]
    expect(getByTag(posts, 'nextjs').map((p) => p.slug)).toEqual(['a'])
  })
})

describe('getAllTags', () => {
  it('published 글의 태그를 개수 내림차순, 같으면 이름순으로 집계한다', () => {
    const posts = [
      make({ slug: 'a', tags: ['blog', 'nextjs'] }),
      make({ slug: 'b', tags: ['blog'] }),
      make({ slug: 'c', tags: ['가나다'], draft: true }),
    ]
    expect(getAllTags(posts)).toEqual([
      { tag: 'blog', count: 2 },
      { tag: 'nextjs', count: 1 },
    ])
  })
})
```

```ts
// src/lib/format.test.ts
import { describe, expect, it } from 'vitest'
import { formatDate } from './format'

describe('formatDate', () => {
  it('ISO 날짜를 한국어 형식으로 바꾼다', () => {
    expect(formatDate('2026-07-12T00:00:00.000Z')).toBe('2026년 7월 12일')
  })
})
```

- [ ] **Step 3: 테스트 실패 확인**

Run: `npm test`
Expected: FAIL — `./posts`, `./format` 모듈 없음

- [ ] **Step 4: 구현**

```ts
// src/lib/posts.ts
export interface PostLike {
  slug: string
  date: string
  draft: boolean
  category: 'tech' | 'life'
  tags: string[]
}

export interface TagCount {
  tag: string
  count: number
}

export function getPublished<T extends PostLike>(posts: T[]): T[] {
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getByCategory<T extends PostLike>(
  posts: T[],
  category: PostLike['category'],
): T[] {
  return getPublished(posts).filter((post) => post.category === category)
}

export function getByTag<T extends PostLike>(posts: T[], tag: string): T[] {
  return getPublished(posts).filter((post) => post.tags.includes(tag))
}

export function getAllTags(posts: PostLike[]): TagCount[] {
  const counts = new Map<string, number>()
  for (const post of getPublished(posts)) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}
```

`getPublished`의 `.filter()`가 새 배열을 만들므로 이어지는 `.sort()`는 원본을 변경하지 않는다.

```ts
// src/lib/format.ts
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(iso))
}
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npm test`
Expected: PASS — 6개 테스트 전부 통과

- [ ] **Step 6: 커밋**

```bash
git add src/lib vitest.config.ts package.json package-lock.json
git commit -m "feat: 글 정렬·필터·태그 집계 유틸 (TDD)"
```

---

### Task 4: 레이아웃, 다크모드, 헤더, About

**Files:**
- Create: `src/config/site.ts`, `src/components/theme-provider.tsx`, `src/components/theme-toggle.tsx`, `src/components/header.tsx`, `src/app/about/page.tsx`
- Modify: `src/app/layout.tsx`, `src/app/globals.css`

**Interfaces:**
- Consumes: 없음
- Produces: `site` 설정 객체 (`{ title: string; url: string; description: string }`), 전 페이지 공통 레이아웃(헤더 + `max-w-2xl` 컨테이너), class 기반 다크모드

- [ ] **Step 1: 의존성 설치**

```bash
npm install next-themes pretendard
```

- [ ] **Step 2: 사이트 설정 파일**

```ts
// src/config/site.ts
export const site = {
  title: 'seonghun.log',
  url: 'https://blog.example.com', // TODO(사용자): Vercel 배포 후 실제 도메인으로 수정
  description: '기술과 일상을 기록하는 개인 블로그',
} as const
```

- [ ] **Step 3: globals.css 교체**

기존 내용을 전부 다음으로 교체:

```css
/* src/app/globals.css */
@import 'tailwindcss';
@import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: 'Pretendard Variable', ui-sans-serif, system-ui, sans-serif;
}

body {
  @apply bg-white font-sans text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100;
}
```

- [ ] **Step 4: 테마 프로바이더와 토글**

```tsx
// src/components/theme-provider.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  )
}
```

```tsx
// src/components/theme-toggle.tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <span className="inline-block h-8 w-8" />

  return (
    <button
      type="button"
      aria-label="테마 전환"
      className="h-8 w-8 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
```

- [ ] **Step 5: 헤더**

```tsx
// src/components/header.tsx
import Link from 'next/link'
import { site } from '@/config/site'
import { ThemeToggle } from './theme-toggle'

const nav = [
  { href: '/tech', label: 'Tech' },
  { href: '/life', label: 'Life' },
  { href: '/tags', label: 'Tags' },
  { href: '/search', label: 'Search' },
  { href: '/about', label: 'About' },
]

export function Header() {
  return (
    <header className="flex items-center justify-between py-6">
      <Link href="/" className="font-bold">
        {site.title}
      </Link>
      <div className="flex items-center gap-1">
        <nav className="flex gap-1 text-sm">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-2 py-1.5 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              {label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
```

- [ ] **Step 6: 루트 레이아웃 교체**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { site } from '@/config/site'

export const metadata: Metadata = {
  title: { default: site.title, template: `%s | ${site.title}` },
  description: site.description,
  metadataBase: new URL(site.url),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="mx-auto min-h-screen max-w-2xl px-4 antialiased">
        <ThemeProvider>
          <Header />
          <main className="py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

`suppressHydrationWarning`은 next-themes가 `<html>`에 class를 주입할 때 나는 hydration 경고를 막기 위해 필요하다.

- [ ] **Step 7: About 페이지 (헤더 링크 dead link 방지)**

```tsx
// src/app/about/page.tsx
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
```

- [ ] **Step 8: 검증**

Run: `npm run build`
Expected: 빌드 성공, `/about` 라우트 출력

Run: `npm run dev` 후 브라우저에서 `http://localhost:3000` 접속
Expected: 헤더·토글 표시, 토글 클릭 시 라이트/다크 전환, 새로고침해도 깜빡임 없이 유지

- [ ] **Step 9: 커밋**

```bash
git add -A
git commit -m "feat: 레이아웃, 다크모드, 헤더, About 페이지"
```

---

### Task 5: 홈 — 글 목록

**Files:**
- Create: `src/components/post-list.tsx`
- Modify: `src/app/page.tsx` (기존 보일러플레이트 전체 교체)

**Interfaces:**
- Consumes: `posts`, `Post` (`#site/content`), `getPublished` (`@/lib/posts`), `formatDate` (`@/lib/format`)
- Produces: `PostList({ posts }: { posts: Post[] })` 컴포넌트 — 이후 카테고리/태그 페이지에서 재사용

- [ ] **Step 1: PostList 컴포넌트**

```tsx
// src/components/post-list.tsx
import Link from 'next/link'
import type { Post } from '#site/content'
import { formatDate } from '@/lib/format'

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="text-neutral-500">아직 글이 없습니다.</p>
  }
  return (
    <ul className="space-y-10">
      {posts.map((post) => (
        <li key={post.slug}>
          <article>
            <Link href={post.permalink}>
              <h2 className="text-lg font-semibold hover:underline">{post.title}</h2>
            </Link>
            <p className="mt-1 text-sm text-neutral-500">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {' · '}
              {post.category}
            </p>
            {post.description && (
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">{post.description}</p>
            )}
          </article>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 2: 홈 페이지 교체**

```tsx
// src/app/page.tsx
import { posts } from '#site/content'
import { PostList } from '@/components/post-list'
import { getPublished } from '@/lib/posts'

export default function HomePage() {
  return <PostList posts={getPublished(posts)} />
}
```

- [ ] **Step 3: 검증**

Run: `npm run build`
Expected: 빌드 성공

Run: `npm run dev` 후 `http://localhost:3000`
Expected: 글 2개(최신순: "블로그를 시작합니다" → "여름 기록")만 보이고 draft 글은 안 보임

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "feat: 홈 글 목록"
```

---

### Task 6: 글 상세 페이지 + 코드 하이라이팅

**Files:**
- Create: `src/app/posts/[slug]/page.tsx`
- Modify: `velite.config.ts` (rehype-pretty-code), `src/app/globals.css` (typography + shiki 테마)

**Interfaces:**
- Consumes: `posts` (`#site/content`), `formatDate`
- Produces: `/posts/[slug]` 정적 페이지. Task 10이 이 파일에 `<Comments />`를 추가함

- [ ] **Step 1: 의존성 설치**

```bash
npm install -D rehype-pretty-code shiki @tailwindcss/typography
```

- [ ] **Step 2: velite.config.ts에 하이라이팅 추가**

`defineConfig` 부분을 다음으로 교체:

```ts
// velite.config.ts (상단에 import 추가)
import rehypePrettyCode from 'rehype-pretty-code'

// ... posts 컬렉션 정의는 그대로 ...

export default defineConfig({
  root: 'content',
  collections: { posts },
  markdown: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: { light: 'github-light', dark: 'github-dark' },
          defaultColor: false,
        },
      ],
    ],
  },
})
```

- [ ] **Step 3: globals.css에 typography 플러그인과 코드 테마 전환 CSS 추가**

`@import 'tailwindcss';` 바로 아래에 추가:

```css
@plugin '@tailwindcss/typography';
```

파일 끝에 추가:

```css
/* rehype-pretty-code 듀얼 테마: 라이트/다크 전환 */
code[data-theme*=' '],
code[data-theme*=' '] span {
  color: var(--shiki-light);
  background-color: var(--shiki-light-bg);
}

.dark code[data-theme*=' '],
.dark code[data-theme*=' '] span {
  color: var(--shiki-dark);
  background-color: var(--shiki-dark-bg);
}

[data-rehype-pretty-code-figure] pre {
  @apply overflow-x-auto rounded-lg border border-neutral-200 p-4 dark:border-neutral-800;
}
```

- [ ] **Step 4: 글 상세 페이지**

```tsx
// src/app/posts/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { posts } from '#site/content'
import { formatDate } from '@/lib/format'

interface Props {
  params: Promise<{ slug: string }>
}

function findPost(slug: string) {
  return posts.find((post) => post.slug === slug && !post.draft)
}

export function generateStaticParams() {
  return posts.filter((post) => !post.draft).map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) return {}
  return { title: post.title, description: post.description }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) notFound()

  return (
    <article>
      <header className="mb-10">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="mt-2 text-sm text-neutral-500">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        {post.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link href={`/tags/${tag}`} className="text-neutral-500 hover:underline">
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>
      <div
        className="prose prose-neutral max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
```

- [ ] **Step 5: 검증**

Run: `npm run build`
Expected: 빌드 성공, `/posts/hello-world`, `/posts/summer-days` 라우트가 SSG로 출력. `/posts/draft-example`은 없어야 함

Run: `npm run dev` 후 `http://localhost:3000/posts/hello-world`
Expected: 본문·코드 하이라이팅 렌더링, 다크모드 전환 시 코드 테마도 함께 전환. `http://localhost:3000/posts/draft-example`은 404

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "feat: 글 상세 페이지 및 코드 하이라이팅"
```

---

### Task 7: 카테고리 페이지 (Tech / Life)

**Files:**
- Create: `src/app/tech/page.tsx`, `src/app/life/page.tsx`

**Interfaces:**
- Consumes: `posts` (`#site/content`), `getByCategory` (`@/lib/posts`), `PostList`
- Produces: `/tech`, `/life` 정적 페이지

- [ ] **Step 1: Tech 페이지**

```tsx
// src/app/tech/page.tsx
import type { Metadata } from 'next'
import { posts } from '#site/content'
import { PostList } from '@/components/post-list'
import { getByCategory } from '@/lib/posts'

export const metadata: Metadata = { title: 'Tech' }

export default function TechPage() {
  return (
    <section>
      <h1 className="mb-8 text-xl font-bold">Tech</h1>
      <PostList posts={getByCategory(posts, 'tech')} />
    </section>
  )
}
```

- [ ] **Step 2: Life 페이지**

```tsx
// src/app/life/page.tsx
import type { Metadata } from 'next'
import { posts } from '#site/content'
import { PostList } from '@/components/post-list'
import { getByCategory } from '@/lib/posts'

export const metadata: Metadata = { title: 'Life' }

export default function LifePage() {
  return (
    <section>
      <h1 className="mb-8 text-xl font-bold">Life</h1>
      <PostList posts={getByCategory(posts, 'life')} />
    </section>
  )
}
```

- [ ] **Step 3: 검증**

Run: `npm run build`
Expected: `/tech`, `/life` 라우트 출력

Run: `npm run dev` 후 `/tech`에는 "블로그를 시작합니다"만, `/life`에는 "여름 기록"만 보이는지 확인

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "feat: 카테고리 페이지"
```

---

### Task 8: 태그 페이지

**Files:**
- Create: `src/app/tags/page.tsx`, `src/app/tags/[tag]/page.tsx`

**Interfaces:**
- Consumes: `posts`, `getAllTags`, `getByTag`, `PostList`
- Produces: `/tags` (태그 목록), `/tags/[tag]` (태그별 글 목록) 정적 페이지

- [ ] **Step 1: 태그 목록 페이지**

```tsx
// src/app/tags/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { posts } from '#site/content'
import { getAllTags } from '@/lib/posts'

export const metadata: Metadata = { title: 'Tags' }

export default function TagsPage() {
  const tags = getAllTags(posts)
  return (
    <section>
      <h1 className="mb-8 text-xl font-bold">Tags</h1>
      {tags.length === 0 ? (
        <p className="text-neutral-500">아직 태그가 없습니다.</p>
      ) : (
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {tags.map(({ tag, count }) => (
            <li key={tag}>
              <Link href={`/tags/${tag}`} className="hover:underline">
                #{tag} <span className="text-sm text-neutral-500">({count})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
```

- [ ] **Step 2: 태그별 글 목록 페이지**

한글 태그가 URL에서 percent-encoding되므로 `decodeURIComponent` 필수.

```tsx
// src/app/tags/[tag]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { posts } from '#site/content'
import { PostList } from '@/components/post-list'
import { getAllTags, getByTag } from '@/lib/posts'

interface Props {
  params: Promise<{ tag: string }>
}

export function generateStaticParams() {
  return getAllTags(posts).map(({ tag }) => ({ tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  return { title: `#${decodeURIComponent(tag)}` }
}

export default async function TagPage({ params }: Props) {
  const tag = decodeURIComponent((await params).tag)
  const tagged = getByTag(posts, tag)
  if (tagged.length === 0) notFound()

  return (
    <section>
      <h1 className="mb-8 text-xl font-bold">#{tag}</h1>
      <PostList posts={tagged} />
    </section>
  )
}
```

- [ ] **Step 3: 검증**

Run: `npm run build`
Expected: `/tags`, `/tags/nextjs`, `/tags/blog`, `/tags/일상` 라우트 출력

Run: `npm run dev` 후 `/tags`에서 `#일상` 클릭 → "여름 기록"만 표시. `/tags/없는태그` → 404

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "feat: 태그 페이지"
```

---

### Task 9: 검색

**Files:**
- Create: `src/components/search.tsx`, `src/app/search/page.tsx`

**Interfaces:**
- Consumes: `posts`, `getPublished`
- Produces: `/search` 페이지. `Search({ items }: { items: SearchItem[] })` 클라이언트 컴포넌트 — `SearchItem = { title: string; description: string; tags: string[]; permalink: string }`

- [ ] **Step 1: 검색 클라이언트 컴포넌트**

서버 컴포넌트(page)가 published 글의 최소 필드만 추려 넘기고, 클라이언트에서 즉시 필터링한다.

```tsx
// src/components/search.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

export interface SearchItem {
  title: string
  description: string
  tags: string[]
  permalink: string
}

export function Search({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const results = q
    ? items.filter((item) =>
        [item.title, item.description, ...item.tags].join(' ').toLowerCase().includes(q),
      )
    : []

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="제목, 설명, 태그로 검색"
        autoFocus
        className="w-full rounded-lg border border-neutral-300 bg-transparent px-4 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:focus:border-neutral-500"
      />
      {q && (
        <ul className="mt-6 space-y-4">
          {results.length === 0 && <li className="text-neutral-500">검색 결과가 없습니다.</li>}
          {results.map((item) => (
            <li key={item.permalink}>
              <Link href={item.permalink} className="font-medium hover:underline">
                {item.title}
              </Link>
              {item.description && (
                <p className="mt-0.5 text-sm text-neutral-500">{item.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 검색 페이지**

```tsx
// src/app/search/page.tsx
import type { Metadata } from 'next'
import { posts } from '#site/content'
import { Search } from '@/components/search'
import { getPublished } from '@/lib/posts'

export const metadata: Metadata = { title: 'Search' }

export default function SearchPage() {
  const items = getPublished(posts).map((post) => ({
    title: post.title,
    description: post.description ?? '',
    tags: post.tags,
    permalink: post.permalink,
  }))

  return (
    <section>
      <h1 className="mb-8 text-xl font-bold">Search</h1>
      <Search items={items} />
    </section>
  )
}
```

- [ ] **Step 3: 검증**

Run: `npm run build`
Expected: `/search` 라우트 출력

Run: `npm run dev` 후 `/search`에서 "여름" 입력 → "여름 기록"만 표시, "draft" 입력 → 결과 없음

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "feat: 클라이언트 검색"
```

---

### Task 10: giscus 댓글

**Files:**
- Create: `src/components/comments.tsx`, `.env.local.example`
- Modify: `src/app/posts/[slug]/page.tsx`

**Interfaces:**
- Consumes: next-themes의 `useTheme`
- Produces: `Comments()` 컴포넌트 — env 미설정 시 null 반환(빌드는 항상 성공)

- [ ] **Step 1: 의존성 설치**

```bash
npm install @giscus/react
```

- [ ] **Step 2: Comments 컴포넌트**

```tsx
// src/components/comments.tsx
'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

const repo = process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}` | undefined
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

export function Comments() {
  const { resolvedTheme } = useTheme()

  if (!repo || !repoId || !category || !categoryId) return null

  return (
    <section className="mt-16">
      <Giscus
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="ko"
      />
    </section>
  )
}
```

- [ ] **Step 3: env 예시 파일**

```bash
# .env.local.example
# giscus 설정 — 블로그 리포를 GitHub에 올리고 Discussions를 활성화한 뒤,
# https://giscus.app 에서 리포를 연결하면 아래 값 4개를 발급해준다.
# 이 파일을 .env.local로 복사하고 값을 채우면 댓글이 켜진다.
# (Vercel에는 프로젝트 설정 > Environment Variables에 동일하게 등록)
NEXT_PUBLIC_GISCUS_REPO=owner/repo
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
```

- [ ] **Step 4: 글 상세 페이지에 추가**

`src/app/posts/[slug]/page.tsx`의 import에 `import { Comments } from '@/components/comments'`를 추가하고, `</article>` 닫는 태그 바로 앞(본문 `<div>` 다음)에 `<Comments />`를 추가:

```tsx
      <div
        className="prose prose-neutral max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <Comments />
    </article>
```

- [ ] **Step 5: 검증**

Run: `npm run build`
Expected: env 미설정 상태에서도 빌드 성공 (Comments가 null 반환)

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "feat: giscus 댓글 (env 설정 시 활성화)"
```

---

### Task 11: RSS, sitemap, 404 페이지

**Files:**
- Create: `src/app/feed.xml/route.ts`, `src/app/sitemap.ts`, `src/app/not-found.tsx`

**Interfaces:**
- Consumes: `posts`, `getPublished`, `getAllTags`, `site`
- Produces: `/feed.xml`, `/sitemap.xml`, 404 페이지 (전부 정적)

- [ ] **Step 1: RSS 라우트**

```ts
// src/app/feed.xml/route.ts
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
```

- [ ] **Step 2: sitemap**

```ts
// src/app/sitemap.ts
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
```

- [ ] **Step 3: 404 페이지**

```tsx
// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="mt-4 text-neutral-500">주소가 잘못되었거나 삭제된 페이지입니다.</p>
      <Link href="/" className="mt-8 inline-block underline">
        홈으로 돌아가기
      </Link>
    </section>
  )
}
```

- [ ] **Step 4: 검증**

Run: `npm run build`
Expected: `/feed.xml`, `/sitemap.xml` 라우트 출력

Run: `npm run dev` 후 `curl -s http://localhost:3000/feed.xml`
Expected: XML에 published 글 2개만 포함 (draft 없음)

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "feat: RSS, sitemap, 404 페이지"
```

---

### Task 12: README와 최종 검증

**Files:**
- Modify: `README.md` (create-next-app 기본 내용 전체 교체)

**Interfaces:**
- Consumes: 전체 결과물
- Produces: 글 작성·배포 가이드 문서, 전체 검증 통과

- [ ] **Step 1: README 작성**

````markdown
<!-- README.md -->
# seonghun.log

Next.js + Velite로 만든 개인 블로그.

## 글 쓰는 법

`content/posts/YYYY-MM-DD-slug.md` 파일을 만든다:

```markdown
---
title: 글 제목
date: 2026-07-12
category: tech        # tech | life
tags: [태그1, 태그2]   # 선택
description: 목록에 보일 요약  # 선택
draft: true           # 선택 — true면 어디에도 노출 안 됨
---

본문을 마크다운으로 작성.
```

- 파일명의 날짜 접두어는 slug에서 제거된다: `2026-07-12-hello-world.md` → `/posts/hello-world`
- frontmatter가 스키마에 안 맞으면 빌드가 실패한다 (실수 방지)
- git push하면 Vercel이 자동 배포

## 로컬 실행

```bash
npm install
npm run dev    # http://localhost:3000
npm test       # 유틸 단위 테스트
npm run build  # 프로덕션 빌드 검증
```

## 배포 후 설정

1. `src/config/site.ts`의 `url`을 실제 도메인으로 수정
2. 댓글: GitHub 리포에 Discussions 활성화 → https://giscus.app 에서 값 발급 → `.env.local.example` 참고해 Vercel 환경변수 등록
````

- [ ] **Step 2: 전체 검증**

Run: `npm test`
Expected: 전부 PASS

Run: `npm run lint`
Expected: 에러 없음

Run: `npm run build`
Expected: 빌드 성공. 라우트 목록에 `/`, `/about`, `/tech`, `/life`, `/tags`, `/tags/[tag]`(3개), `/search`, `/posts/[slug]`(2개), `/feed.xml`, `/sitemap.xml` 포함

- [ ] **Step 3: 커밋**

```bash
git add -A
git commit -m "docs: README 글 작성 가이드"
```

---

## 이후 사용자 액션 (계획 범위 외)

1. GitHub 리포 생성 후 push
2. Vercel에서 리포 import → 자동 배포
3. `src/config/site.ts` url 수정, giscus 환경변수 등록 (README 참고)
