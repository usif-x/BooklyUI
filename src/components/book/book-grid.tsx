import type { Book } from '@/lib/types'
import { BookCard } from '@/components/book/book-card'

export function BookGrid({
  books,
  className,
  heading,
  count,
}: {
  books: Book[]
  className?: string
  heading?: string
  count?: number
}) {
  const shown = count ? books.slice(0, count) : books
  return (
    <section aria-label={heading ?? 'Books'} className={className}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {shown.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}