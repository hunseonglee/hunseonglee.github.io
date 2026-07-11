# 개인 블로그 디자인 스펙

날짜: 2026-07-12
상태: 승인됨

## 개요

기술 글과 일상 글을 함께 올리는 개인 블로그. 마크다운 파일로 글을 작성하고 git push하면 배포되는 정적 사이트.

## 요구사항

- 콘텐츠: 기술 글 + 일상 글 혼합, 카테고리(`tech` / `life`)로 구분
- 글 작성: 리포 안의 마크다운 파일 (`content/posts/*.md`)
- 기능: 다크모드, 태그/카테고리, 댓글, 검색
- 배포: Vercel
- 디자인: 미니멀/타이포그래피 중심

## 스택

| 영역 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | Next.js (App Router, TypeScript) | 사용자 선호 |
| 콘텐츠 | Velite | frontmatter 스키마를 Zod로 정의, 빌드 시 검증·타입 생성 |
| 스타일 | Tailwind CSS | 미니멀 디자인에 충분, 다크모드 지원 용이 |
| 배포 | Vercel | git push 자동 배포, 무료 플랜 |

대안으로 gray-matter 직접 구현(B), @next/mdx(C)를 검토했으나, 태그·카테고리·검색이 모두 글 메타데이터 기반 기능이므로 스키마 검증이 있는 Velite(A)를 선택.

## 아키텍처

```
content/posts/*.md  →  Velite (빌드 시 파싱·검증)  →  .velite/ (타입 있는 JSON)
                                                        ↓
                                           Next.js 페이지에서 import해서 렌더링
                                                        ↓
                                            전부 정적 페이지로 빌드 → Vercel
```

- 모든 페이지는 빌드 시점에 정적 생성(SSG). 서버 로직·DB 없음.
- 글 발행 흐름: 마크다운 작성 → git push → Vercel 자동 빌드·배포

### 콘텐츠 스키마 (frontmatter)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `title` | string | O | 글 제목 |
| `date` | date | O | 발행일 |
| `category` | `"tech"` \| `"life"` | O | 카테고리 |
| `tags` | string[] | X (기본 `[]`) | 태그 목록 |
| `description` | string | X | 목록/OG에 쓰이는 요약 |
| `draft` | boolean | X (기본 `false`) | true면 목록·빌드에서 제외 |

slug는 파일명에서 생성 (예: `2026-07-12-my-first-post.md` → `/posts/my-first-post`).

### 프로젝트 구조

```
content/
  posts/                 # 글 마크다운 파일
src/
  app/
    page.tsx             # 홈 = 최근 글 목록
    posts/[slug]/        # 글 상세
    tags/[tag]/          # 태그별 글 목록
    tech/, life/         # 카테고리별 글 목록
    about/               # 소개 페이지
  components/            # 헤더, 글 카드, 다크모드 토글, 검색, 댓글 등
  lib/                   # 글 정렬/필터/태그 수집 유틸
velite.config.ts         # 콘텐츠 스키마 정의
```

## 기능별 구현

| 기능 | 방법 |
|---|---|
| 다크모드 | `next-themes` — 시스템 설정 추종 + 수동 토글, FOUC 없음 |
| 태그/카테고리 | Velite 데이터에서 빌드 시 수집 → `generateStaticParams`로 정적 페이지 생성 |
| 댓글 | giscus (GitHub Discussions 기반). 블로그 리포에 Discussions 활성화 후 연결. 다크모드 테마 연동 |
| 검색 | 빌드 시 제목+설명+태그 JSON 인덱스 생성 → 클라이언트에서 필터링. 글 수백 개 규모까지 충분 |
| 코드 하이라이팅 | `rehype-pretty-code` (Shiki) — 빌드 시 하이라이팅, 런타임 JS 없음, 라이트/다크 테마 연동 |
| RSS/사이트맵 | 빌드 시 생성 (feed.xml, sitemap.xml) |

## 디자인 방향

- 본문 최대 폭 ~65자, 넉넉한 행간·여백
- 폰트: Pretendard (한글), 모노스페이스 (코드)
- 색 절제: 배경/텍스트 + 포인트 컬러 1개
- 홈: 이미지 없는 글 제목·날짜·설명 리스트

## 에러 처리

- frontmatter 스키마 위반 → Velite가 빌드 실패시킴 (잘못된 글은 배포 불가)
- 존재하지 않는 slug/태그 → 404 페이지
- draft: true 글은 목록·태그·검색 인덱스·RSS 모두에서 제외

## 테스트

- `lib/` 유틸 함수(정렬, 필터, 태그 수집)에 단위 테스트 (Vitest)
- UI는 빌드 성공 + 로컬 확인으로 갈음 (개인 블로그 규모에서 UI 테스트는 과함)

## 범위 외 (YAGNI)

- 관리자 페이지, DB, 인증
- 조회수/애널리틱스 (필요 시 Vercel Analytics를 나중에 추가)
- i18n, 뉴스레터
