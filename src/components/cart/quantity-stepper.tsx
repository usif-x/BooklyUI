'use client'

import * as React from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { cn } from '@/lib/utils'

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const dims =
    size === 'sm'
      ? '[&>button]:h-8 [&>button]:w-8 [&>button]:text-sm'
      : size === 'lg'
        ? '[&>button]:h-12 [&>button]:w-12 [&>button]:text-lg'
        : '[&>button]:h-10 [&>button]:w-10'
  return (
    <ButtonGroup className={cn(dims, className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span
        aria-live="polite"
        className="inline-flex h-10 min-w-10 items-center justify-center border-3 border-foreground bg-card px-2 text-sm font-black"
      >
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  )
}