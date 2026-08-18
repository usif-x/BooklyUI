'use client'

import * as React from 'react'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Rating } from '@/components/ui/rating'
import { Sticker } from '@/components/ui/sticker'
import { BookCover } from '@/components/book/book-cover'
import { useCart, useWishlist } from '@/providers/store-providers'
import { cn } from '@/lib/utils'
import type { Book } from '@/lib/types'
import { toast } from 'sonner'

function WishlistButton({ book, className }: { book: Book; className?: string }) {
  const { isWishlisted, toggle } = useWishlist()
  const active = isWishlisted(book.id)

  return (
    <button
      type="button"
      aria-label={active ? `Remove ${book.name} from wishlist` : `Add ${book.name} to wishlist`}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault()
        toggle(book.id)
        toast[active ? 'info' : 'success'](active ? 'REMOVED FROM WISHLIST' : 'SAVED TO WISHLIST', {
          description: book.name,
        })
      }}
      className={cn(
        'bk-interactive inline-flex h-9 w-9 items-center justify-center border-3 border-foreground bg-card shadow-[4px_4px_0px_hsl(var(--shadow-color))] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        active && 'bg-accent text-accent-foreground',
        className
      )}
    >
      <Heart className={cn('h-4 w-4', active && 'fill-current')} />
    </button>
  )
}

export function BookCard({ book, className }: { book: Book; className?: string }) {
  const { addItem, openCart } = useCart()

  const discount = book.hasDiscount ? book.discountPercentage : null

  return (
    <Card
      className={cn(
        'group flex h-full flex-col overflow-hidden transition-transform duration-150 hover:-translate-y-1',
        className
      )}
    >
      <Link
        href={`/product/${book.slug}`}
        className="relative block border-b-3 border-foreground"
        aria-label={`View ${book.name}`}
      >
        <div className="relative overflow-hidden bg-muted">
          <BookCover
            id={book.id}
            title={book.name}
            author={book.author}
            category={book.category}
            className="aspect-[3/4] w-full transition-transform duration-200 group-hover:scale-[1.04]"
          />
        </div>
        <div className="pointer-events-none absolute -left-1 -top-1 z-10 flex -rotate-3 flex-col items-start gap-1">
          {discount ? (
            <Sticker variant="destructive" size="sm" rotation="slight" shadow="double">
              -{discount}%
            </Sticker>
          ) : book.isNew ? (
            <Sticker variant="primary" size="sm" rotation="slight" shadow="default">
              NEW!
            </Sticker>
          ) : null}
          {book.isBestSeller && (
            <Sticker variant="secondary" size="sm" rotation="slight-right" shadow="default" dashed>
              <span className="flex items-center gap-1">BESTSELLER</span>
            </Sticker>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="pointer-events-none">
            {book.category}
          </Badge>
          <WishlistButton book={book} />
        </div>

        <h3 className="line-clamp-2 font-display text-lg leading-tight uppercase">
          <Link
            href={`/product/${book.slug}`}
            className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {book.name}
          </Link>
        </h3>

        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          by {book.author}
        </p>

        <div className="flex items-center gap-2">
          <Rating value={book.rating} readOnly size="sm" />
          <span className="text-xs font-black">({book.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-xl font-black">${book.price.toFixed(2)}</span>
            {book.originalPrice && (
              <span className="text-sm font-bold text-muted-foreground line-through">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {book.stock <= 10 && (
            <Badge variant={book.stock === 0 ? 'destructive' : 'warning'} className="pointer-events-none">
              {book.stock === 0 ? 'SOLD OUT' : `ONLY ${book.stock} LEFT`}
            </Badge>
          )}
        </div>

        <Button
          variant="default"
          size="sm"
          className="mt-2 w-full"
          disabled={book.stock === 0}
          onClick={() => {
            addItem(book.id)
            toast.success('ADDED TO CART', { description: `${book.name} — $${book.price.toFixed(2)}` })
            openCart()
          }}
        >
          <ShoppingCart className="h-4 w-4" />
          {book.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
        </Button>
      </div>
    </Card>
  )
}