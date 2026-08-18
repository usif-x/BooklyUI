import * as React from 'react'
import { cn } from '@/lib/utils'

type BlobAnimation = 'none' | 'float' | 'wiggle' | 'spin' | 'pulse' | 'bounce'
type BlobSpeed = 'slow' | 'normal' | 'fast'

const ANIM_CLASSES = {
  float: 'shape-animate-float',
  wiggle: 'shape-animate-wiggle',
  spin: 'shape-animate-spin',
  pulse: 'shape-animate-pulse',
  bounce: 'shape-animate-bounce',
} as const

function animClass(animation: BlobAnimation, speed: BlobSpeed): string {
  if (animation === 'none') return ''
  const suffix = speed === 'normal' ? '' : `-${speed}`
  return ANIM_CLASSES[animation] + suffix
}

// Deterministic Haikei-style blob: radius modulated by gentle harmonics,
// converted to a smooth closed loop via Catmull-Rom → cubic Bézier.
function buildBlobPath(seeds: [number, number, number, number]): string {
  const points = 64
  const pts: [number, number][] = []
  for (let i = 0; i < points; i++) {
    const t = (i / points) * Math.PI * 2
    const [a3, b3, a5, b5] = seeds
    const r =
      50 +
      a3 * Math.sin(3 * t + b5) +
      b3 * Math.sin(5 * t + b5 * 2) +
      a5 * Math.sin(7 * t + 1.3)
    pts.push([50 + r * Math.cos(t), 50 + r * Math.sin(t)])
  }

  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} `
  for (let i = 0; i < points; i++) {
    const p0 = pts[(i - 1 + points) % points]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % points]
    const p3 = pts[(i + 2) % points]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)} `
  }
  return `${d}Z`
}

const BLOB_PATHS: string[] = [
  buildBlobPath([12, 7, 8, 0.9]),
  buildBlobPath([14, 5, 9, 2.2]),
  buildBlobPath([11, 7, 7, 3.1]),
  buildBlobPath([15, 4, 10, 1.6]),
]

export interface HaikeiBlobProps extends React.SVGProps<SVGSVGElement> {
  variant?: number
  size?: number
  animation?: BlobAnimation
  speed?: BlobSpeed
}

/**
 * Organic Haikei-style blob. Decorative only — paint with text-* color
 * utilities (e.g. text-primary) and position it absolutely.
 */
export function HaikeiBlob({
  variant = 0,
  size = 100,
  animation = 'none',
  speed = 'normal',
  className,
  ...props
}: HaikeiBlobProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn(
        'pointer-events-none select-none',
        animClass(animation, speed),
        className
      )}
      {...props}
    >
      <path d={BLOB_PATHS[variant % BLOB_PATHS.length]} fill="currentColor" />
    </svg>
  )
}