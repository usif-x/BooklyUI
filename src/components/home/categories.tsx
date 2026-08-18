import Link from 'next/link'
import { ArrowUpRight, BookOpen } from 'lucide-react'
import { BurstShape, ScribbleUnderline, Star6Shape } from '@/components/ui/shapes'
import { categories, books } from '@/data/books'

export function CategoryCard({
  name,
  blurb,
  color,
  accent,
  count,
  className,
}: {
  name: string
  blurb: string
  color: string
  accent: string
  count: number
  className?: string
}) {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(name)}`}
      className={`group relative flex flex-col justify-between border-3 border-foreground p-5 shadow-[6px_6px_0px_hsl(var(--shadow-color))] transition-all duration-150 hover:-translate-y-1 hover:shadow-[10px_10px_0px_hsl(var(--shadow-color))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className ?? ''}`}
      style={{ backgroundColor: color }}
    >
      <div className="flex items-start justify-between">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center border-3 border-foreground bg-white/90 text-foreground"
          style={{ backgroundColor: accent }}
        >
          <BookOpen className="h-4 w-4" />
        </span>
        <ArrowUpRight className="h-6 w-6 text-white transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <div className="mt-8">
        <h3 className="font-display text-2xl uppercase leading-none text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,0.35)] md:text-3xl">
          {name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs font-bold uppercase tracking-wide text-white/90">
          {blurb}
        </p>
        <span className="mt-3 inline-block border-2 border-foreground bg-background px-2 py-0.5 text-xs font-black uppercase shadow-[3px_3px_0px_rgba(0,0,0,0.45)]">
          {count} TITLES
        </span>
      </div>
    </Link>
  )
}

export function CategoryPosters() {
  return (
    <section aria-label="Browse by category" className="relative flex min-h-screen flex-col justify-center overflow-hidden border-y-3 border-foreground bg-card">
      <Star6Shape
        size={48}
        animation="float"
        speed="slow"
        className="absolute right-6 top-10 rotate-12 text-accent"
      />
      <BurstShape
        size={64}
        animation="pulse"
        speed="slow"
        className="absolute bottom-2 left-[42%] -rotate-6 text-primary"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl uppercase leading-none md:text-6xl">
            PICK YOUR
            <span className="block text-primary">
              VIBE
              <ScribbleUnderline
                size={140}
                className="absolute -bottom-2 left-0 text-secondary"
              />
            </span>
          </h2>
          <p className="max-w-xs text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Ten shelves. One rule: read what hits different.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.name}
              {...cat}
              count={books.filter((b) => b.category === cat.name).length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}