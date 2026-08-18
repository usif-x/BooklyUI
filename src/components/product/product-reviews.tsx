'use client'

import { Rating } from '@/components/ui/rating'
import { UserAvatar } from '@/components/decor/user-avatar'
import { Star4Shape, Star5Shape } from '@/components/ui/shapes'
import type { Book, Review } from '@/lib/types'

export function ProductReviews({ book, reviews }: { book: Book; reviews: Review[] }) {
  const pct = Math.round((book.rating / 5) * 100)

  return (
    <section id="reviews" aria-label="Reader reviews" className="relative mt-16 scroll-mt-24">
      <Star5Shape
        size={34}
        animation="float"
        speed="slow"
        className="absolute -top-4 right-[38%] text-accent"
      />
      <Star4Shape
        size={24}
        animation="float"
        speed="fast"
        className="absolute bottom-2 right-[4%] text-info"
      />
      <h2 className="font-display text-4xl uppercase leading-[0.9] md:text-5xl">
        WHAT
        <span className="block">READERS</span>
        <span className="block text-primary">SAY</span>
      </h2>

      <div className="mt-6 inline-flex items-center gap-4 border-3 border-foreground bg-primary px-5 py-3 shadow-[6px_6px_0px_hsl(var(--shadow-color))]">
        <span className="font-display text-4xl text-primary-foreground">{book.rating.toFixed(1)}</span>
        <div>
          <Rating value={book.rating} readOnly size="md" />
          <p className="text-xs font-black uppercase tracking-wide text-primary-foreground">
            {book.reviewCount} VERIFIED REVIEWS · {pct}% RECOMMEND
          </p>
        </div>
      </div>

      <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review, i) => (
          <li
            key={review.id}
            className={
              'flex flex-col gap-3 border-3 border-foreground bg-card p-5 shadow-[5px_5px_0px_hsl(var(--shadow-color))] ' +
              (i % 3 === 1 ? 'rotate-[0.5deg]' : i % 3 === 2 ? '-rotate-[0.5deg]' : '')
            }
          >
            <div className="flex items-center gap-3">
              <UserAvatar name={review.name} size="sm" frame={false} className="h-11 w-11 border-3 border-foreground" />
              <div>
                <p className="text-sm font-black uppercase">{review.name}</p>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">
                  {new Date(review.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="ml-auto border-2 border-foreground px-1.5 py-0.5 text-[10px] font-black uppercase shadow-[2px_2px_0px_hsl(var(--shadow-color))]"
                style={{ backgroundColor: review.avatarColor, color: '#fff' }}
              >
                ✓ VERIFIED
              </span>
            </div>
            <Rating value={review.rating} readOnly size="sm" />
            <p className="text-sm font-medium leading-relaxed">{review.comment}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}