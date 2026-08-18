import * as React from 'react'
import { cn } from '@/lib/utils'

interface TypographyCanvasProps {
  /** Poster words — rendered in huge display type, cropped by the parent. */
  words?: string[]
  /** Opacity paint utility, e.g. `text-foreground/5`. */
  paint?: string
  className?: string
  /** Column gaps to tune the poster composition. */
  gaps?: string
}

/**
 * Subtle poster-like typographic background layer (canvas).
 * Decorative only: absolutely positioned, non-interactive, aria-hidden.
 * Parent must be `relative overflow-hidden`.
 */
export function TypographyCanvas({
  words = ['BOOKS', 'READ', 'CREATE', 'LEARN', 'STORIES'],
  paint = 'text-foreground/[0.05]',
  className,
  gaps = 'gap-10',
}: TypographyCanvasProps) {
  const [a, b, c] = words
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 z-0 select-none overflow-hidden font-display uppercase leading-none tracking-tight',
        className
      )}
    >
      <div
        className={cn(
          'absolute -left-[4%] top-1/2 flex -translate-y-1/2 -rotate-6 flex-col whitespace-nowrap',
          gaps,
          paint
        )}
      >
        <span className="text-[7rem] md:text-[11rem]">{a}</span>
        <span className="text-[5rem] md:text-[8rem]">{b}</span>
      </div>
      <div
        className={cn(
          'absolute -right-[6%] top-2 flex rotate-3 flex-col items-end whitespace-nowrap',
          gaps,
          paint
        )}
      >
        <span className="text-[5rem] md:text-[8rem]">{c}</span>
        <span className="text-[7rem] md:text-[11rem]">{b}</span>
      </div>
      <div
        className={cn(
          'absolute -bottom-[8%] left-1/4 flex -rotate-12 flex-col whitespace-nowrap',
          gaps,
          paint
        )}
      >
        <span className="text-[5.5rem] md:text-[9rem]">{a}</span>
        <span className="text-[6.5rem] md:text-[10rem]">{c}</span>
      </div>
    </div>
  )
}