import { describe, expect, it } from 'vitest'
import { formatDate, formatMonthDay } from './format'

describe('formatMonthDay', () => {
  it('월·일을 2자리로 채운 "MM. DD" 형식으로 바꾼다', () => {
    expect(formatMonthDay('2026-07-12T00:00:00.000Z')).toBe('07. 12')
    expect(formatMonthDay('2026-11-03T00:00:00.000Z')).toBe('11. 03')
  })
})

describe('formatDate', () => {
  it('ISO 날짜를 한국어 형식으로 바꾼다', () => {
    expect(formatDate('2026-07-12T00:00:00.000Z')).toBe('2026년 7월 12일')
  })
})
