export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(iso))
}

/** 아카이브 목록용 짧은 날짜: "07. 12" (UTC 기준, formatDate와 일관) */
export function formatMonthDay(iso: string): string {
  const date = new Date(iso)
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${month}. ${day}`
}
