# seonghun.log

Next.js + Velite로 만든 개인 블로그.

## 글 쓰는 법

`content/posts/YYYY-MM-DD-slug.md` 파일을 만든다:

````markdown
---
title: 글 제목
date: 2026-07-12
category: tech        # tech | life
tags: [태그1, 태그2]   # 선택
description: 목록에 보일 요약  # 선택
draft: true           # 선택 — true면 어디에도 노출 안 됨
---

본문을 마크다운으로 작성.
````

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
