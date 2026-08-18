import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sticker } from '@/components/ui/sticker'
import { BookCover } from '@/components/book/book-cover'
import { SplatShape, Star4Shape, Star5Shape } from '@/components/ui/shapes'
import { HaikeiBlob } from '@/components/decor/haikei-blob'
import { TypographyCanvas } from '@/components/decor/typography-canvas'
import { HandDrawnArrow } from '@/components/decor/hand-drawn-arrow'
import { PersonReading } from '@/components/decor/illustrations'
import { Reveal } from '@/components/decor/reveal'
import { Topography } from '@/components/ui/canvas-effects/Topography'
import { books } from '@/data/books'

const HERO_BOOKS = [
  { book: books[0], variant: 0, className: '-rotate-6 z-10', sticker: 'NEW!', stickerClass: 'bg-accent', width: 'w-24 sm:w-40 md:w-52' },
  { book: books[3], variant: 1, className: 'translate-y-10 rotate-3 z-20', sticker: 'BESTSELLER', stickerClass: 'bg-secondary', width: 'w-28 sm:w-44 md:w-60' },
  { book: books[8], variant: 2, className: 'rotate-6 -translate-y-4 z-0', sticker: '-30%', stickerClass: 'bg-destructive', width: 'w-24 sm:w-36 md:w-44' },
]

export function Hero() {
  return (
    <section aria-label="Bookly hero" className="relative flex min-h-screen flex-col justify-center overflow-hidden border-b-3 border-foreground">
      <Topography
        lineColor="#8ecae6"
        levels={12}
        speed={1}
        className="absolute inset-0 h-full w-full"
      />
      <TypographyCanvas words={['BOOKS', 'READ', 'STORIES', 'CREATE']} />
      <HaikeiBlob
        variant={0}
        size={340}
        animation="float"
        speed="slow"
        className="absolute -right-24 -top-28 text-primary opacity-90 md:block"
      />
      <HaikeiBlob
        variant={2}
        size={280}
        className="absolute -bottom-16 -left-28 text-accent/70 md:block"
      />
      <HaikeiBlob
        variant={1}
        size={120}
        animation="float"
        speed="fast"
        className="absolute bottom-12 right-[6%] text-success lg:block"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
        <Reveal>
          <div className="relative">
            <Sticker variant="primary" size="sm" rotation="slight" shadow="default" className="mb-6">
              <span className="flex items-center gap-2">★ FRESH STOCK · 10 CATEGORIES ★</span>
            </Sticker>

            <h1 className="font-display uppercase leading-[0.9] tracking-tight">
              <span className="block text-6xl md:text-7xl xl:text-8xl">BOOKS</span>
              <span className="block text-6xl md:text-7xl xl:text-8xl">THAT</span>
              <span className="mt-2 inline-block bg-primary px-3 text-6xl text-primary-foreground shadow-[6px_6px_0px_hsl(var(--shadow-color))] md:text-7xl xl:text-8xl">
                HIT
              </span>
              <span className="mt-2 block text-6xl text-stroke md:text-7xl xl:text-8xl">
                DIFFERENT.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base font-bold uppercase tracking-wide text-muted-foreground md:text-lg">
              Discover stories, ideas, and knowledge worth keeping.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" asChild className="h-14 px-10 text-base">
                <Link href="/products">
                  SHOP BOOKS <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild className="h-14 px-10 text-base">
                <Link href="/products?discount=1">EXPLORE DEALS</Link>
              </Button>
            </div>

            <HandDrawnArrow className="absolute -bottom-2 -right-6 hidden w-28 rotate-[12deg] text-secondary xl:block" />
            <Star5Shape
              size={32}
              animation="float"
              speed="slow"
              className="absolute left-[20%] top-[34%] text-accent"
            />
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative mx-auto flex items-center justify-center py-8 md:py-0" aria-hidden="true">
            <div className="relative flex items-end justify-center gap-0">
              {HERO_BOOKS.map(({ book, variant, className, sticker, stickerClass, width }, i) => (
                <div key={book.id} className={`relative ${className} ${width} shrink-0 ${i === 1 ? '-mx-4 md:-mx-6' : ''}`}>
                  <div className="border-3 border-foreground bg-card shadow-[8px_8px_0px_hsl(var(--shadow-color))]">
                    <BookCover
                      id={book.id}
                      title={book.name}
                      author={book.author}
                      category={book.category}
                      variant={variant}
                      className="w-full"
                    />
                  </div>
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 -rotate-3 border-3 border-foreground px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_hsl(var(--shadow-color))] ${stickerClass} text-foreground`}
                  >
                    {sticker}
                  </span>
                </div>
              ))}
              <span className="absolute -bottom-6 right-2 -rotate-6 border-3 border-foreground bg-primary px-3 py-1 text-xs font-black uppercase shadow-[4px_4px_0px_hsl(var(--shadow-color))]">
                READ MORE
              </span>
              <span className="absolute -left-4 top-4 rotate-6 border-3 border-foreground bg-success px-2 py-1 text-[10px] font-black uppercase shadow-[3px_3px_0px_hsl(var(--shadow-color))]">
                -40% SALE
              </span>
            </div>

            <SplatShape
              size={44}
              animation="wiggle"
              speed="slow"
              className="absolute right-6 -top-12 rotate-12 text-destructive"
            />
            <Star5Shape
              size={36}
              animation="float"
              speed="slow"
              className="absolute -right-8 top-4 text-accent"
            />
            <Star4Shape
              size={28}
              animation="float"
              speed="fast"
              className="absolute -left-10 top-1/2 text-info"
            />
            <div className="absolute -bottom-14 -left-12 hidden w-36 -rotate-6 md:block">
              <PersonReading className="w-full" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}