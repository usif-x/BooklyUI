import * as React from 'react'
import { getCategory } from '@/data/books'

type BookCoverProps = {
  id: string
  title: string
  author: string
  category: string
  className?: string
  variant?: number
}

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

const PATTERNS = ['stripes', 'dots', 'grid', 'triangles', 'rings'] as const

function wrapTitle(title: string): string[] {
  const words = title.toUpperCase().split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length > 12 && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
    if (lines.length === 3) break
  }
  if (current) lines.push(current)
  return lines.slice(0, 3)
}

const Pattern = ({
  kind,
  color,
  opacity,
}: {
  kind: (typeof PATTERNS)[number]
  color: string
  opacity: number
}) => {
  const common = { fill: color, fillOpacity: opacity }
  switch (kind) {
    case 'stripes':
      return (
        <g transform="rotate(-24 60 100)">
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={i * 16 - 60} y="-20" width="8" height="280" {...common} />
          ))}
        </g>
      )
    case 'dots':
      return (
        <g>
          {Array.from({ length: 70 }, (_, i) => (
            <circle
              key={i}
              cx={(i * 29) % 140}
              cy={(i * 41) % 200}
              r={2 + (i % 3)}
              {...common}
            />
          ))}
        </g>
      )
    case 'grid':
      return (
        <g>
          {Array.from({ length: 8 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={i * 20}
              y1={0}
              x2={i * 20}
              y2={200}
              stroke={color}
              strokeOpacity={opacity}
              strokeWidth={2}
            />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * 22}
              x2={140}
              y2={i * 22}
              stroke={color}
              strokeOpacity={opacity}
              strokeWidth={2}
            />
          ))}
        </g>
      )
    case 'triangles':
      return (
        <g>
          {Array.from({ length: 6 }, (_, i) => {
            const x = (i * 47 + 10) % 130
            const y = (i * 53 + 20) % 170
            return (
              <polygon key={i} points={`${x},${y} ${x + 34},${y + 8} ${x + 17},${y + 34}`} {...common} />
            )
          })}
        </g>
      )
    case 'rings':
      return (
        <g>
          {Array.from({ length: 5 }, (_, i) => (
            <circle
              key={i}
              cx={70 + ((i * 37) % 40) - 20}
              cy={100 + ((i * 29) % 40) - 20}
              r={30 + i * 14}
              fill="none"
              stroke={color}
              strokeOpacity={opacity}
              strokeWidth={5}
            />
          ))}
        </g>
      )
  }
}

/**
 * Deterministic generative book cover. Renders a branded SVG "cover" per book
 * so the demo works fully offline and every cover looks designed.
 */
export function BookCover({
  id,
  title,
  author,
  category,
  className,
  variant = 0,
}: BookCoverProps) {
  const cat = getCategory(category)
  const h = hash(id) + variant * 7919
  const bg = cat?.color ?? '#4c4cf0'
  const accent = cat?.accent ?? '#ffdc00'
  const pattern = PATTERNS[h % PATTERNS.length]
  const rotated = (h / 7) % 2 === 0
  const lines = wrapTitle(variant === 0 ? title : `${title} ${'•'.repeat(variant)}`)

  return (
    <svg
      viewBox="0 0 140 200"
      role="img"
      aria-label={`Cover of ${title} by ${author}`}
      className={className}
    >
      <rect width="140" height="200" fill={bg} />
      <Pattern kind={pattern} color={accent} opacity={0.25} />
      <rect x="0" y="0" width="10" height="200" fill={accent} />
      <circle cx="8" cy="100" r="3" fill={bg} />
      {rotated && (
        <text
          x="104"
          y="186"
          fill={accent}
          fontSize="22"
          fontFamily="monospace"
          fontWeight="900"
          transform="rotate(-90 104 186)"
        >
          ★★★
        </text>
      )}
      <rect x="10" y="14" width="26" height="38" fill="none" stroke={accent} strokeWidth="2" />
      <text
        x="23"
        y="30"
        fill={accent}
        fontFamily="monospace"
        fontWeight="900"
        fontSize="9"
        textAnchor="middle"
      >
        BK
      </text>
      <text
        x="94"
        y="28"
        fill={accent}
        fontFamily="monospace"
        fontWeight="700"
        fontSize="8"
        textAnchor="end"
        letterSpacing="1"
      >
        BOOKLY
      </text>
      <rect x="14" y="56" width="112" height="2" fill={accent} />
      {lines.map((line, i) => (
        <text
          key={i}
          x="14"
          y={86 + i * 22}
          fill="#ffffff"
          fontFamily="sans-serif"
          fontWeight="900"
          fontSize="17"
          letterSpacing="0.5"
        >
          {line}
        </text>
      ))}
      <text x="14" y="168" fill={accent} fontFamily="monospace" fontWeight="700" fontSize="9" letterSpacing="1">
        {author.toUpperCase().slice(0, 24)}
      </text>
      <text x="14" y="184" fill="#ffffff" opacity="0.7" fontFamily="monospace" fontSize="8" letterSpacing="2">
        {category.toUpperCase()}
      </text>
    </svg>
  )
}