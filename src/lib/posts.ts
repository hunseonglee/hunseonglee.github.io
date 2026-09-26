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

export interface YearGroup<T> {
  year: number
  posts: T[]
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

/** published 글을 연도별로 묶는다. 최신 연도부터, 연도 안에서도 최신순(getPublished 기준). */
export function groupByYear<T extends PostLike>(posts: T[]): YearGroup<T>[] {
  const groups = new Map<number, T[]>()
  for (const post of getPublished(posts)) {
    const year = new Date(post.date).getUTCFullYear()
    const bucket = groups.get(year)
    if (bucket) bucket.push(post)
    else groups.set(year, [post])
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, posts]) => ({ year, posts }))
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
