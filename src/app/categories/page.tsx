import type { Metadata } from 'next'
import { CategoryCard } from '@/components/home/categories'
import { MarqueeStrip } from '@/components/footer/footer'
import { categories, books } from '@/data/books'

export const metadata: Metadata = {
  title: 'CATEGORIES — BOOKLY',
}

export default function CategoriesPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="font-display text-5xl uppercase leading-none md:text-7xl">
          TEN
          <span className="block text-primary">SHELVES.</span>
        </h1>
        <p className="mt-3 max-w-md text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Every category is a door. Pick one and start opening it.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.name}
              {...cat}
              count={books.filter((b) => b.category === cat.name).length}
            />
          ))}
        </div>
      </section>
      <MarqueeStrip />
    </>
  )
}