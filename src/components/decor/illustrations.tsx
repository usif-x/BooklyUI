import * as React from 'react'
import { cn } from '@/lib/utils'

const STROKE = '4'

const PALETTE = {
  skin: '#f3b48c',
  foreground: 'hsl(var(--foreground))',
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  success: 'hsl(var(--success))',
  background: 'hsl(var(--background))',
  shadow: 'hsl(var(--shadow-color))',
}

/**
 * Chunky neo-brutalist human illustrations (hand-drawn flat SVG).
 * Decorative only — keep `aria-hidden` and never block clicks.
 */

export function PersonReading({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 210 210" aria-hidden="true" className={cn('pointer-events-none select-none', className)}>
      <rect x="16" y="16" width="180" height="184" rx="10" fill={PALETTE.shadow} />
      <rect x="56" y="10" width="74" height="26" rx="9" fill={PALETTE.foreground} />
      <circle cx="93" cy="42" r="32" fill={PALETTE.skin} stroke={PALETTE.foreground} strokeWidth={STROKE} />
      <circle cx="82" cy="42" r="3.5" fill={PALETTE.foreground} />
      <circle cx="104" cy="42" r="3.5" fill={PALETTE.foreground} />
      <path d="M82,58 Q93,66 104,58" fill="none" stroke={PALETTE.foreground} strokeWidth={STROKE} strokeLinecap="round" />
      <rect x="68" y="84" width="50" height="58" rx="8" fill={PALETTE.secondary} stroke={PALETTE.foreground} strokeWidth={STROKE} />
      <path d="M70,96 C58,106 58,124 66,136" fill="none" stroke={PALETTE.foreground} strokeWidth="9" strokeLinecap="round" />
      <path d="M116,96 C128,106 128,124 120,136" fill="none" stroke={PALETTE.foreground} strokeWidth="9" strokeLinecap="round" />
      <path d="M93,140 C78,146 66,148 56,146 L56,182 C66,184 78,182 93,177 Z" fill={PALETTE.background} stroke={PALETTE.foreground} strokeWidth={STROKE} strokeLinejoin="round" />
      <path d="M93,140 C108,146 120,148 130,146 L130,182 C120,184 108,182 93,177 Z" fill={PALETTE.primary} stroke={PALETTE.foreground} strokeWidth={STROKE} strokeLinejoin="round" />
      <line x1="93" y1="140" x2="93" y2="177" stroke={PALETTE.foreground} strokeWidth={STROKE} strokeLinecap="round" />
      <rect x="70" y="142" width="44" height="18" rx="4" fill={PALETTE.success} stroke={PALETTE.foreground} strokeWidth={STROKE} />
      <rect x="72" y="142" width="14" height="40" rx="4" fill={PALETTE.accent} stroke={PALETTE.foreground} strokeWidth={STROKE} />
      <rect x="98" y="142" width="14" height="40" rx="4" fill={PALETTE.primary} stroke={PALETTE.foreground} strokeWidth={STROKE} />
    </svg>
  )
}

export function PersonWaving({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 210 210" aria-hidden="true" className={cn('pointer-events-none select-none', className)}>
      <rect x="16" y="16" width="180" height="184" rx="10" fill={PALETTE.shadow} />
      <rect x="56" y="10" width="74" height="26" rx="9" fill={PALETTE.foreground} />
      <circle cx="93" cy="42" r="32" fill={PALETTE.skin} stroke={PALETTE.foreground} strokeWidth={STROKE} />
      <circle cx="82" cy="42" r="3.5" fill={PALETTE.foreground} />
      <circle cx="104" cy="42" r="3.5" fill={PALETTE.foreground} />
      <path d="M82,58 Q93,66 104,58" fill="none" stroke={PALETTE.foreground} strokeWidth={STROKE} strokeLinecap="round" />
      <rect x="68" y="84" width="50" height="58" rx="8" fill={PALETTE.accent} stroke={PALETTE.foreground} strokeWidth={STROKE} />
      <path d="M70,96 C58,106 58,122 66,132" fill="none" stroke={PALETTE.foreground} strokeWidth="9" strokeLinecap="round" />
      <path d="M116,96 C130,86 136,70 134,56 C133,52 130,50 126,52" fill="none" stroke={PALETTE.foreground} strokeWidth="9" strokeLinecap="round" />
      <circle cx="126" cy="50" r="11" fill={PALETTE.success} stroke={PALETTE.foreground} strokeWidth={STROKE} />
      <rect x="72" y="142" width="14" height="40" rx="4" fill={PALETTE.secondary} stroke={PALETTE.foreground} strokeWidth={STROKE} />
      <rect x="98" y="142" width="14" height="40" rx="4" fill={PALETTE.primary} stroke={PALETTE.foreground} strokeWidth={STROKE} />
    </svg>
  )
}

export function BookStack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" aria-hidden="true" className={cn('pointer-events-none select-none', className)}>
      <g transform="rotate(-5 100 110)" stroke={PALETTE.foreground} strokeWidth={STROKE} strokeLinejoin="round">
        <rect x="34" y="96" width="136" height="18" rx="4" fill={PALETTE.background} />
      </g>
      <g stroke={PALETTE.foreground} strokeWidth={STROKE} strokeLinejoin="round">
        <rect x="10" y="118" width="122" height="18" rx="4" fill={PALETTE.shadow} />
      </g>
      <g stroke={PALETTE.foreground} strokeWidth={STROKE} strokeLinejoin="round">
        <rect x="28" y="112" width="140" height="18" rx="4" fill={PALETTE.primary} />
      </g>
      <g stroke={PALETTE.foreground} strokeWidth={STROKE} strokeLinejoin="round">
        <rect x="42" y="94" width="128" height="18" rx="4" fill={PALETTE.accent} />
      </g>
      <g stroke={PALETTE.foreground} strokeWidth={STROKE} strokeLinejoin="round" transform="rotate(18 158 90)">
        <rect x="150" y="62" width="14" height="40" rx="3" fill={PALETTE.secondary} />
      </g>
    </svg>
  )
}