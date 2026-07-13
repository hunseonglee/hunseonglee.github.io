import { describe, expect, it } from 'vitest'
import { formatDate } from './format'

describe('formatDate', () => {
  it('ISO 날짜를 한국어 형식으로 바꾼다', () => {
    expect(formatDate('2026-07-12T00:00:00.000Z')).toBe('2026년 7월 12일')
  })
})
