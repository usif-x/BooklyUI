'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delay in ms before the reveal transition starts. */
  delay?: number
}

/**
 * Subtle viewport reveal — CSS transforms/opacity only.
 * Content starts hidden and slides up once, then is removed from observation.
 */
export function Reveal({ delay = 0, className, children, ...props }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.remove('translate-y-4', 'opacity-0')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-500 ease-out will-change-transform',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}