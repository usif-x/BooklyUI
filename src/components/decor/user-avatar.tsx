import * as React from 'react'
import multiavatar from '@multiavatar/multiavatar'
import { cn } from '@/lib/utils'

const SIZES = {
  sm: 'h-9 w-9',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
  xl: 'h-28 w-28',
} as const

export type UserAvatarSize = keyof typeof SIZES

export interface UserAvatarProps {
  /** Seed for the avatar — deterministic, typically the user or reviewer name. */
  name: string
  size?: UserAvatarSize
  /** Brutalist sticker frame (thick border + offset shadow). Default: true. */
  frame?: boolean
  className?: string
}

/**
 * Deterministic multiavatar rendered inside a neo-brutalist square frame.
 * Safe: the seed only drives the generated pattern, it is never embedded
 * as markup or text inside the SVG.
 */
export function UserAvatar({ name, size = 'md', frame = true, className }: UserAvatarProps) {
  const svg = name ? multiavatar(name).trim() : ''

  const inner = (
    <div
      aria-hidden="true"
      className={cn(
        SIZES[size],
        className,
        frame &&
          'overflow-hidden border-3 border-foreground bg-background shadow-[4px_4px_0px_hsl(var(--shadow-color))]'
      )}
    >
      {svg ? (
        <div
          className="h-full w-full [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-black">
          ?
        </div>
      )}
    </div>
  )

  if (!frame) {
    return <div className={cn('overflow-hidden', className)}>{inner}</div>
  }
  return inner
}