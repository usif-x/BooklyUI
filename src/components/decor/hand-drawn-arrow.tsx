import * as React from 'react'
import { cn } from '@/lib/utils'

type ArrowDirection = 'right' | 'left' | 'down' | 'up-right'

const BODIES: Record<ArrowDirection, { line: string; head: string }> = {
  right: {
    line: 'M4,53 C18,44 30,58 42,51 C56,43 66,55 78,49',
    head: '80,40 95,49 77,61',
  },
  left: {
    line: 'M96,53 C82,44 70,58 58,51 C44,43 34,55 22,49',
    head: '20,40 5,49 23,61',
  },
  down: {
    line: 'M52,6 C42,22 60,30 52,44 C44,58 54,68 50,80',
    head: '36,78 49,95 60,78',
  },
  'up-right': {
    line: 'M6,92 C20,78 34,66 48,52 C60,40 70,30 80,22',
    head: '84,30 95,14 86,38',
  },
}

export interface HandDrawnArrowProps extends React.SVGProps<SVGSVGElement> {
  direction?: ArrowDirection
  strokeWidth?: number
}

/**
 * Hand-drawn squiggle arrow. Decorative only — paint with text-* utilities.
 */
export function HandDrawnArrow({
  direction = 'right',
  strokeWidth = 4,
  className,
  ...props
}: HandDrawnArrowProps) {
  const { line, head } = BODIES[direction]
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn(
        'pointer-events-none select-none h-16 w-24',
        className
      )}
      {...props}
    >
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path d={head} fill="currentColor" strokeLinejoin="round" />
    </svg>
  )
}