export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(iso))
}
