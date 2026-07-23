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
        aria-label="검색"
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
