'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  BadgeCheck,
  ChevronRight,
  Heart,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Rating } from '@/components/ui/rating'
import { Sticker } from '@/components/ui/sticker'
import { BookCover } from '@/components/book/book-cover'
import { BookGrid } from '@/components/book/book-grid'
import { ProductReviews } from '@/components/product/product-reviews'
import { QuantityStepper } from '@/components/cart/quantity-stepper'
import { HandDrawnArrow } from '@/components/decor/hand-drawn-arrow'
import { HeartShape, Star5Shape } from '@/components/ui/shapes'
import { books, getReviewsForBook } from '@/data/books'
import { useCart, useWishlist } from '@/providers/store-providers'
import { cn } from '@/lib/utils'
import type { Book } from '@/lib/types'

function StockBanner({ book }: { book: Book }) {
  if (book.stock === 0) {
    return (
      <div className="border-3 border-foreground bg-destructive p-3 text-sm font-black uppercase tracking-wide text-destructive-foreground shadow-[4px_4px_0px_hsl(var(--shadow-color))]">
        ✕ OUT OF STOCK — BACK SOON
      </div>
    )
  }
  const urgent = book.stock <= 10
  return (
    <div
      className={cn(
        'flex items-center gap-2 border-3 border-foreground p-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0px_hsl(var(--shadow-color))]',
        urgent ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground'
      )}
    >
      <ShieldCheck className="h-5 w-5" />
      {urgent ? (
        <>
          LOW STOCK — ONLY {book.stock} LEFT
          <span aria-hidden="true" className="animate-pulse-scale ml-auto text-base">
            !
          </span>
        </>
      ) : (
        <>IN STOCK — SHIPS IN 24H</>
      )}
    </div>
  )
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-3 border-foreground bg-card p-4 shadow-[4px_4px_0px_hsl(var(--shadow-color))]">
      <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-bold uppercase leading-snug">{value}</dd>
    </div>
  )
}

export function ProductDetail({ book }: { book: Book }) {
  const { addItem, openCart } = useCart()
  const { isWishlisted, toggle } = useWishlist()
  const [quantity, setQuantity] = React.useState(1)
  const [activeVariant, setActiveVariant] = React.useState(0)

  const wishlisted = isWishlisted(book.id)
  const discount = book.hasDiscount ? book.discountPercentage ?? 0 : 0
  const reviews = getReviewsForBook(book)
  const related = books
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 4)
  const fallbackRelated = related.length
    ? related
    : books.filter((b) => b.id !== book.id).slice(0, 4)

  const details: [string, string][] = [
    ['AUTHOR', book.author],
    ['PUBLISHER', book.publisher ?? 'Bookly Press'],
    ['PUBLISHED', book.publicationDate ? new Date(book.publicationDate).getFullYear().toString() : '—'],
    ['ISBN', book.isbn ?? '—'],
    ['PAGES', book.pages ? String(book.pages) : '—'],
    ['LANGUAGE', book.language ?? '—'],
    ['FORMAT', book.format ?? '—'],
    ['CATEGORY', book.category],
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">HOME</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="transition-colors hover:text-foreground">BOOKS</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/products?category=${encodeURIComponent(book.category)}`}
          className="transition-colors hover:text-foreground"
        >
          {book.category.toUpperCase()}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{book.name.toUpperCase()}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="relative flex flex-col items-center gap-4">
          <Star5Shape
            size={36}
            animation="float"
            speed="slow"
            className="absolute -left-4 top-6 hidden text-accent md:block"
          />
          <HeartShape
            size={30}
            animation="wiggle"
            speed="slow"
            className="absolute -right-3 bottom-36 hidden rotate-12 text-destructive md:block"
          />
          <div className="relative w-full max-w-sm border-3 border-foreground bg-card shadow-[8px_8px_0px_hsl(var(--shadow-color))] transition-all duration-200 hover:-translate-y-1 hover:shadow-[12px_12px_0px_hsl(var(--shadow-color))]">
            <BookCover
              id={book.id}
              title={book.name}
              author={book.author}
              category={book.category}
              variant={activeVariant}
              className="w-full"
            />
            {book.isNew && (
              <Sticker
                variant="primary"
                size="sm"
                rotation="heavy"
                shadow="double"
                className="absolute -left-3 -top-3"
              >
                NEW!
              </Sticker>
            )}
            {discount > 0 && (
              <Sticker
                variant="destructive"
                size="lg"
                rotation="heavy-right"
                shadow="double"
                className="absolute -right-4 -top-4"
              >
                -{discount}% OFF
              </Sticker>
            )}
          </div>
          <div className="flex gap-3" role="tablist" aria-label="Cover variants">
            {[0, 1, 2].map((variant) => (
              <button
                key={variant}
                role="tab"
                aria-selected={activeVariant === variant}
                aria-label={`Cover variant ${variant + 1}`}
                onClick={() => setActiveVariant(variant)}
                className={cn(
                  'w-20 border-3 border-foreground bg-card p-1 shadow-[4px_4px_0px_hsl(var(--shadow-color))] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none',
                  activeVariant === variant && 'bg-primary p-0.5'
                )}
              >
                <BookCover
                  id={book.id}
                  title={book.name}
                  author={book.author}
                  category={book.category}
                  variant={variant}
                  className="w-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="pointer-events-none">{book.category}</Badge>
            {book.isBestSeller && <Badge variant="secondary">BESTSELLER</Badge>}
            {book.hasDiscount && <Badge variant="destructive">-{discount}%</Badge>}
            {book.isNew && <Badge>NEW</Badge>}
          </div>

          <h1 className="mt-3 font-display text-4xl uppercase leading-[0.95] md:text-5xl">
            {book.name}
          </h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            by <span className="text-foreground">{book.author}</span>
          </p>

          <div className="mt-3 flex items-center gap-3">
            <Rating value={book.rating} readOnly size="md" />
            <span className="text-sm font-black">{book.rating.toFixed(1)}</span>
            <a
              href="#reviews"
              className="text-sm font-bold uppercase text-secondary underline-offset-4 hover:underline"
            >
              {book.reviewCount} REVIEWS
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl">${book.price.toFixed(2)}</span>
            {book.originalPrice && (
              <>
                <span className="text-xl font-bold text-muted-foreground line-through">
                  ${book.originalPrice.toFixed(2)}
                </span>
                <span className="border-3 border-foreground bg-destructive px-2 py-0.5 text-xs font-black uppercase text-destructive-foreground shadow-[3px_3px_0px_hsl(var(--shadow-color))]">
                  SAVE ${(book.originalPrice - book.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          <div className="mt-5">
            <StockBanner book={book} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <QuantityStepper size="lg" value={quantity} onChange={setQuantity} max={Math.max(book.stock, 1)} />
            <p className="text-xs font-bold uppercase text-muted-foreground">
              {book.stock > 0 ? `${book.stock} IN STOCK` : 'OUT OF STOCK'}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <div className="relative">
              <HandDrawnArrow className="absolute -top-11 right-8 hidden w-24 rotate-[-10deg] text-secondary sm:block" />
              <Button
                size="lg"
                className="h-14 w-full text-base sm:w-auto sm:min-w-64"
                disabled={book.stock === 0}
              onClick={() => {
                addItem(book.id, quantity)
                toast.success('ADDED TO CART', {
                  description: `${quantity} × ${book.name}`,
                })
                openCart()
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              ADD TO CART
            </Button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                size="lg"
                className="h-14 flex-1 text-base"
                disabled={book.stock === 0}
                onClick={() => {
                  addItem(book.id, quantity)
                  toast('CHECKOUT COMING SOON!', {
                    description: 'Demo store — your cart is ready for takeoff.',
                  })
                  openCart()
                }}
              >
                <Zap className="h-5 w-5" />
                BUY NOW
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 flex-1 text-base"
                aria-pressed={wishlisted}
                onClick={() => {
                  toggle(book.id)
                  toast[wishlisted ? 'info' : 'success'](
                    wishlisted ? 'REMOVED FROM WISHLIST' : 'SAVED TO WISHLIST'
                  )
                }}
              >
                <Heart className={cn('h-5 w-5', wishlisted && 'fill-current text-accent')} />
                {wishlisted ? 'IN WISHLIST' : 'ADD TO WISHLIST'}
              </Button>
            </div>
          </div>

          <ul className="mt-8 grid gap-2 text-xs font-black uppercase tracking-wide text-muted-foreground sm:grid-cols-3">
            <li className="flex items-center gap-2 border-2 border-foreground bg-card p-3">
              <Truck className="h-4 w-4" /> FREE SHIPPING $50+
            </li>
            <li className="flex items-center gap-2 border-2 border-foreground bg-card p-3">
              <ShieldCheck className="h-4 w-4" /> 30-DAY RETURNS
            </li>
            <li className="flex items-center gap-2 border-2 border-foreground bg-card p-3">
              <BadgeCheck className="h-4 w-4" /> AUTHENTIC COPIES
            </li>
          </ul>
        </div>
      </div>

      {/* About */}
      <section aria-label="About this book" className="mt-16">
        <h2 className="font-display text-4xl uppercase leading-none md:text-5xl">
          ABOUT THIS
          <span className="block text-primary">BOOK</span>
        </h2>
        <div className="mt-6 border-3 border-foreground bg-card p-6 shadow-[6px_6px_0px_hsl(var(--shadow-color))] md:p-8">
          <p className="max-w-3xl text-base font-medium leading-relaxed md:text-lg">
            {book.description}
          </p>
        </div>
      </section>

      {/* Details */}
      <section aria-label="Book details" className="mt-16">
        <h2 className="font-display text-4xl uppercase leading-none md:text-5xl">
          BOOK
          <span className="block text-primary">DETAILS</span>
        </h2>
        <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {details.map(([label, value]) => (
            <DetailBlock key={label} label={label} value={value} />
          ))}
        </dl>
      </section>

      {/* Reviews */}
      <ProductReviews book={book} reviews={reviews} />

      {/* Related */}
      <section aria-label="Related books" className="mt-16">
        <h2 className="font-display text-4xl uppercase leading-none md:text-5xl">
          RELATED
          <span className="block text-primary">READS</span>
        </h2>
        <BookGrid books={fallbackRelated} className="mt-6" />
      </section>
    </div>
  )
}