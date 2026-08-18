import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookGrid } from '@/components/book/book-grid'
import { HandDrawnArrow } from '@/components/decor/hand-drawn-arrow'
import { ScribbleUnderline, Star4Shape, Star5Shape } from '@/components/ui/shapes'
import { books } from '@/data/books'

export function FeaturedReads() {
  const featured = books.filter((b) => b.isFeatured).slice(0, 8)
  return (
    <section aria-label="Featured books" className="relative flex min-h-screen w-full flex-col justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="relative font-display text-4xl uppercase leading-none md:text-6xl">
          FEATURED
          <span className="block text-primary">
            READS
            <ScribbleUnderline
              size={180}
              className="absolute -bottom-3 left-0 text-secondary"
            />
          </span>
          <Star5Shape
            size={40}
            animation="float"
            speed="slow"
            className="absolute -left-12 -top-6 hidden text-accent md:block"
          />
          <Star4Shape
            size={30}
            animation="float"
            speed="fast"
            className="absolute -bottom-4 right-[36%] hidden text-info md:block"
          />
        </h2>
        <div className="relative">
          <Button variant="outline" asChild>
            <Link href="/products">
              VIEW ALL BOOKS <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <HandDrawnArrow className="absolute -top-9 right-0 hidden w-20 rotate-6 text-secondary md:block" />
        </div>
      </div>
      <BookGrid books={featured} className="mt-8" />
      </div>
    </section>
  )
}