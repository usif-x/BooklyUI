'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowUpDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { EmptyState, EmptyStateDescription, EmptyStateIcon, EmptyStateTitle } from '@/components/ui/empty-state'
import { BookGrid } from '@/components/book/book-grid'
import { FilterPanel, DEFAULT_FILTERS, activeFilterCount, type FilterState } from '@/components/products/filters'
import { books } from '@/data/books'
import type { Book } from '@/lib/types'

export type SortOption = 'featured' | 'best-selling' | 'price-asc' | 'price-desc' | 'top-rated' | 'newest'

const SORT_LABELS: Record<SortOption, string> = {
  featured: 'FEATURED',
  'best-selling': 'BEST SELLING',
  'price-asc': 'PRICE ↑',
  'price-desc': 'PRICE ↓',
  'top-rated': 'TOP RATED',
  newest: 'NEWEST',
}

const PRICE_BOUNDS: [number, number] = [10, 30]

function applyFilters(books: Book[], filters: FilterState, query: string) {
  const q = query.trim().toLowerCase()
  return books.filter((book) => {
    if (q && !`${book.name} ${book.author} ${book.category}`.toLowerCase().includes(q)) {
      return false
    }
    if (filters.category && book.category !== filters.category) return false
    if (book.price > filters.maxPrice) return false
    if (filters.minRating > 0 && book.rating < filters.minRating) return false
    if (filters.discountOnly && !book.hasDiscount) return false
    if (filters.inStockOnly && book.stock === 0) return false
    return true
  })
}

function sortBooks(all: Book[], sort: SortOption) {
  const sorted = [...all]
  switch (sort) {
    case 'featured':
      return sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.reviewCount - a.reviewCount)
    case 'best-selling':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount)
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'top-rated':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

export function ProductsCatalog() {
  const searchParams = useSearchParams()
  const [query, setQuery] = React.useState(searchParams.get('q') ?? '')
  const [filters, setFilters] = React.useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    category: searchParams.get('category'),
    discountOnly: searchParams.get('discount') === '1',
  }))
  const [sort, setSort] = React.useState<SortOption>('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false)

  const filtered = sortBooks(applyFilters(books, filters, query), sort)
  const filterCount = activeFilterCount(filters)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-5xl uppercase leading-none md:text-7xl">
        ALL
        <span className="block text-primary">BOOKS.</span>
      </h1>
      <p className="mt-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {books.length} TITLES · FRESH STOCK · FREE SHIPPING OVER $50
      </p>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
        <form
          role="search"
          className="relative flex-1"
          onSubmit={(e) => e.preventDefault()}
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH FOR A BOOK..."
            aria-label="Search for a book"
            className="h-14 border-3 pl-12 pr-12 text-base"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 border-2 border-foreground bg-card p-1 shadow-[3px_3px_0px_hsl(var(--shadow-color))] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border-3 border-foreground bg-card px-3 py-2 shadow-[4px_4px_0px_hsl(var(--shadow-color))]">
            <ArrowUpDown className="h-4 w-4 shrink-0" />
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger aria-label="Sort books" className="h-auto w-44 border-0 bg-transparent p-0 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {SORT_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            className="relative h-11 lg:hidden"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" /> FILTERS
            {filterCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center border-3 border-foreground bg-accent px-1 text-xs font-black shadow-[2px_2px_0px_hsl(var(--shadow-color))]">
                {filterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-20 hidden border-3 border-foreground bg-card p-5 shadow-[6px_6px_0px_hsl(var(--shadow-color))] lg:block">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            priceBounds={PRICE_BOUNDS}
            clearable={filterCount > 0}
            onClear={() => setFilters(DEFAULT_FILTERS)}
          />
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-black uppercase tracking-wide">
              SHOWING <span className="text-primary">{filtered.length}</span> OF {books.length} BOOKS
            </p>
            {filterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setFilters(DEFAULT_FILTERS)}>
                <X className="h-3.5 w-3.5" /> RESET ALL
              </Button>
            )}
          </div>

          {filtered.length === 0 ? (
            <EmptyState variant="card" size="lg" className="py-16">
              <EmptyStateIcon iconColor="destructive" size="xl">
                <Search className="h-10 w-10" />
              </EmptyStateIcon>
              <EmptyStateTitle className="font-display text-2xl">NO BOOKS FOUND</EmptyStateTitle>
              <EmptyStateDescription>
                Nothing matches that search. Try fewer filters — the perfect book is hiding.
              </EmptyStateDescription>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setQuery('')
                  setFilters(DEFAULT_FILTERS)
                }}
              >
                CLEAR EVERYTHING
              </Button>
            </EmptyState>
          ) : (
            <BookGrid books={filtered} />
          )}
        </div>
      </div>

      <Drawer open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DrawerContent className="max-h-[85dvh]">
          <DrawerHeader>
            <DrawerTitle className="font-display text-xl">FILTERS</DrawerTitle>
            <DrawerDescription>Squeeze the catalog down to exactly what you want.</DrawerDescription>
          </DrawerHeader>
          <div className="bk-scroll-brutal overflow-y-auto px-6 pb-6">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              priceBounds={PRICE_BOUNDS}
              clearable={filterCount > 0}
              onClear={() => setFilters(DEFAULT_FILTERS)}
            />
            <Button className="mt-6 w-full" size="lg" onClick={() => setMobileFiltersOpen(false)}>
              SHOW {filtered.length} BOOKS
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}