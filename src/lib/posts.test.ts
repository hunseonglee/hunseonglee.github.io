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
