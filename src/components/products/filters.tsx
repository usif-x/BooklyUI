'use client'

import * as React from 'react'
import { SlidersHorizontal, Tag, Star, PackageCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { categories } from '@/data/books'

export type FilterState = {
  category: string | null
  maxPrice: number
  minRating: number
  discountOnly: boolean
  inStockOnly: boolean
}

export const DEFAULT_FILTERS: FilterState = {
  category: null,
  maxPrice: 30,
  minRating: 0,
  discountOnly: false,
  inStockOnly: false,
}

export function activeFilterCount(f: FilterState) {
  let n = 0
  if (f.category) n++
  if (f.maxPrice < 30) n++
  if (f.minRating > 0) n++
  if (f.discountOnly) n++
  if (f.inStockOnly) n++
  return n
}

export function FilterPanel({
  filters,
  onChange,
  priceBounds,
  clearable,
  onClear,
  className,
}: {
  filters: FilterState
  onChange: (next: FilterState) => void
  priceBounds: [number, number]
  clearable?: boolean
  onClear?: () => void
  className?: string
}) {
  const set = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch })

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-xl uppercase">
          <SlidersHorizontal className="h-5 w-5" /> FILTERS
        </h2>
        {clearable && (
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={onClear}>
            <X className="h-3.5 w-3.5" /> CLEAR
          </Button>
        )}
      </div>

      <fieldset>
        <legend className="mb-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
          CATEGORY
        </legend>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={filters.category === null}
            onClick={() => set({ category: null })}
            className={cn(
              'bk-interactive border-3 border-foreground px-3 py-1.5 text-xs font-black uppercase shadow-[3px_3px_0px_hsl(var(--shadow-color))] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none',
              filters.category === null ? 'bg-primary text-primary-foreground' : 'bg-card'
            )}
          >
            ALL
          </button>
          {categories.map((cat) => {
            const active = filters.category === cat.name
            return (
              <button
                key={cat.name}
                type="button"
                aria-pressed={active}
                onClick={() => set({ category: active ? null : cat.name })}
                className={cn(
                  'bk-interactive border-3 border-foreground px-3 py-1.5 text-xs font-black uppercase shadow-[3px_3px_0px_hsl(var(--shadow-color))] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none',
                  active ? 'text-white' : 'bg-card'
                )}
                style={active ? { backgroundColor: cat.color } : undefined}
              >
                {cat.name}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 flex w-full items-center justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
          MAX PRICE <span className="text-foreground">${filters.maxPrice.toFixed(0)}</span>
        </legend>
        <Slider
          value={[filters.maxPrice]}
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={1}
          onValueChange={(v) => set({ maxPrice: v[0] })}
          aria-label="Maximum price"
          className="max-w-full"
        />
        <div className="mt-1 flex justify-between text-[10px] font-bold text-muted-foreground">
          <span>${priceBounds[0]}</span>
          <span>${priceBounds[1]}</span>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
          MIN RATING
        </legend>
        <div className="flex flex-wrap gap-2">
          {[0, 4, 4.5].map((rating) => {
            const active = filters.minRating === rating
            return (
              <button
                key={rating}
                type="button"
                aria-pressed={active}
                onClick={() => set({ minRating: active ? 0 : rating })}
                className={cn(
                  'bk-interactive flex items-center gap-1 border-3 border-foreground px-3 py-1.5 text-xs font-black uppercase shadow-[3px_3px_0px_hsl(var(--shadow-color))] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none',
                  active ? 'bg-accent text-accent-foreground' : 'bg-card'
                )}
              >
                <Star className={cn('h-3.5 w-3.5', active && 'fill-current')} />
                {rating === 0 ? 'ANY' : `${rating}+`}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-4">
        <Label className="flex cursor-pointer items-center gap-3 text-sm font-black uppercase">
          <Checkbox
            checked={filters.discountOnly}
            onCheckedChange={(v) => set({ discountOnly: v === true })}
          />
          <Tag className="h-4 w-4 text-destructive" /> ON SALE ONLY
        </Label>
        <Label className="flex cursor-pointer items-center gap-3 text-sm font-black uppercase">
          <Checkbox
            checked={filters.inStockOnly}
            onCheckedChange={(v) => set({ inStockOnly: v === true })}
          />
          <PackageCheck className="h-4 w-4 text-success" /> IN STOCK ONLY
        </Label>
      </div>
    </div>
  )
}