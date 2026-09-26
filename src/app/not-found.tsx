import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="mt-4 text-meta">주소가 잘못되었거나 삭제된 페이지입니다.</p>
      <Link href="/" className="mt-8 inline-block underline">
        홈으로 돌아가기
      </Link>
    </section>
  )
}
